'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User, ArrowRight, ArrowDown, Maximize2, Minimize2 } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '@/lib/actions/chat.actions';
import { cn } from '@/lib/utils';

interface AIChatOverlayProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Lightweight message render boundary to prevent a single bad message crashing the chat UI
class MessageErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error('Chat message render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <span className="text-red-300 text-xs">[message failed to render]</span>;
    }
    return this.props.children as any;
  }
}

// Sanitize text for safe display in bubbles
function sanitizeForDisplay(input: unknown, maxLen = 8000): string {
  try {
    let s: string = '';
    if (typeof input === 'string') s = input;
    else if (input == null) s = '';
    else if (input instanceof Error) s = input.message || String(input);
    else s = typeof input === 'object' ? JSON.stringify(input) : String(input);

    // Strip control characters except common whitespace (tab, newline, carriage return)
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    // Remove obviously invalid lone surrogates
    s = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '').replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
    // Trim overly long content
    if (s.length > maxLen) s = s.slice(0, maxLen) + '…';
    return s;
  } catch {
    return '';
  }
}

// Client-safe API helpers to avoid importing server actions in client components
async function apiGetUserContext(userId: string): Promise<string> {
  const res = await fetch(`/api/user-context?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`getUserContext failed (${res.status})`);
  const data = await res.json();
  return data.context as string;
}

async function apiRefreshUserContext(userId: string): Promise<string> {
  const res = await fetch('/api/user-context', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, action: 'refresh' }),
  });
  if (!res.ok) throw new Error(`refreshUserContext failed (${res.status})`);
  const data = await res.json();
  return data.context as string;
}

async function apiRunAIContextAgent(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userId: string,
  userContext: string | null
): Promise<{ assistantMessage: { role: 'assistant'; content: string } | null; priceContext?: any | null }> {
  const res = await fetch('/api/ai/context', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userId, userContext }),
  });
  if (!res.ok) throw new Error(`context agent failed (${res.status})`);
  return res.json();
}

async function apiDecideTrades(
  userInput: string,
  userContext: string | null,
  priceContextJSON?: any
): Promise<any | null> {
  const res = await fetch('/api/ai/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInput, userContext, priceContextJSON }),
  });
  if (!res.ok) throw new Error(`trade agent failed (${res.status})`);
  const data = await res.json();
  return data.proposal ?? null;
}

async function apiExecuteTradeOrders(userId: string, orders: any[]): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/ai/trade/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, orders }),
  });
  if (!res.ok) throw new Error(`execute trade failed (${res.status})`);
  return res.json();
}

const AIChatOverlay: React.FC<AIChatOverlayProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<string | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [contextUpdatedAt, setContextUpdatedAt] = useState<Date | null>(null);
  const [contextJustUpdated, setContextJustUpdated] = useState(false);
  const [resetConversationOnNext, setResetConversationOnNext] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contextLoadedRef = useRef(false); // Track if context was loaded this session
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [livePrices, setLivePrices] = useState<Record<string, { price: number | null; currency: string }>>({});
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<Date | null>(null);
  const liveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const extractContextAsOf = (context: string | null): Date | null => {
    if (!context) return null;
    const m = context.match(/BEGIN_USER_CONTEXT_JSON\n([\s\S]*?)\nEND_USER_CONTEXT_JSON/);
    if (m && m[1]) {
      try {
        const obj = JSON.parse(m[1]);
        if (obj?.asOf) return new Date(obj.asOf);
      } catch {}
    }
    return null;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user context when chat opens
  useEffect(() => {
    if (isOpen && !isLoadingContext && !contextLoadedRef.current) {
      setIsLoadingContext(true);
      contextLoadedRef.current = true; // Mark as loaded for this session
      apiGetUserContext(user.id)
        .then((context) => {
          setUserContext(context);
      const asOf = extractContextAsOf(context) || new Date();
      setContextUpdatedAt(asOf);
          setContextJustUpdated(true);
          setTimeout(() => setContextJustUpdated(false), 2500);
        })
        .catch((error) => {
          console.error('Error fetching user context:', error);
          contextLoadedRef.current = false; // Reset on error to allow retry
        })
        .finally(() => {
          setIsLoadingContext(false);
        });
    }
    
    // Reset context loaded flag when chat is closed
    if (!isOpen && contextLoadedRef.current) {
      contextLoadedRef.current = false;
    }
  }, [isOpen, user.id, isLoadingContext]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Add welcome message when chat is first opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi! I'm Hodlini, your personal trading companion.\n\nI use real‑time market data, and you can buy or sell crypto and stocks with USD right here in chat. Ask me for ideas, analysis, or help with your portfolio.",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // If a trade was executed previously, start a fresh context for the model by not sending prior messages
      const useFreshContext = resetConversationOnNext;
      if (useFreshContext) setResetConversationOnNext(false);
      const sendMessages = useFreshContext ? [userMessage] : updatedMessages;

      // Always fetch the latest user context before processing the message
      let freshContext: string | null = userContext;
      try {
        const latest = await apiGetUserContext(user.id);
        freshContext = latest;
        setUserContext(latest);
        const asOf = extractContextAsOf(latest) || new Date();
        setContextUpdatedAt(asOf);
      } catch (e) {
        console.warn('Could not refresh user context before message:', e);
      }
      // Step 1: Run info/context agent first to decide and fetch price context, and produce assistant reply
      let assistantAdded = false;
      let priceContext: any | null = null;
      try {
        const result = await apiRunAIContextAgent(
          sendMessages.map(m => ({ role: m.role, content: m.content })),
          user.id,
          freshContext || null
        );
        priceContext = result?.priceContext ?? null;
        if (result?.assistantMessage) {
          setMessages(prev => [...prev, { role: 'assistant', content: result.assistantMessage!.content, timestamp: new Date() }]);
          assistantAdded = true;
        }
      } catch (e) {
        console.error('Context agent failed:', e);
      }

      // Step 2: With the price context, ask trade agent to decide if buy/sell is requested
      try {
        const maybeProposal = await apiDecideTrades(userMessage.content, freshContext, priceContext ?? undefined);
        if (maybeProposal && maybeProposal.orders?.length) {
          const assistantTrade: ChatMessage = {
            role: 'assistant',
            content: 'Trade proposal ready. Please review and authorize.',
            timestamp: new Date(),
            tradeProposal: maybeProposal,
          };
          setMessages(prev => [...prev, assistantTrade]);
          // Reset conversation context for the next user message as soon as the proposal is shown,
          // so the model won't carry over intent if the user ignores the trade card.
          setResetConversationOnNext(true);
          return;
        }
      } catch (e) {
        console.error('decideTrades failed:', e);
      }

      // Step 3: Fallback to plain chat if no assistant response was added yet
      if (!assistantAdded) {
        try {
          const assistantMessage = await sendChatMessage(sendMessages, freshContext);
          if (assistantMessage) {
            setMessages(prev => [...prev, assistantMessage]);
          } else {
            const errorMessage: ChatMessage = {
              role: 'assistant',
              content: 'No response generated. Please try rephrasing your request.',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
          }
        } catch (err) {
          const msg = extractErrorMessage(err);
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: `Error: ${msg}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const msg = extractErrorMessage(error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${msg}`,
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Extract readable message from unknown errors for user-facing chat output
  const extractErrorMessage = (err: unknown): string => {
    try {
      if (typeof err === 'string') return err;
      if (err instanceof Error) return err.message || err.name || 'Unexpected error';
      if (err && typeof err === 'object') {
        const e: any = err as any;
        if (typeof e.message === 'string' && e.message) return e.message;
        // HTTP-like error info
        if (e.status || e.statusText || e.code) {
          const parts = [e.code, e.status && `HTTP ${e.status}`, e.statusText]
            .filter(Boolean)
            .join(' ');
          if (parts) return parts;
        }
        if (e.response) {
          const r = e.response;
          const head = [r.status && `HTTP ${r.status}`, r.statusText].filter(Boolean).join(' ');
          if (r.data) {
            if (typeof r.data === 'string') return `${head ? head + ': ' : ''}${r.data}`;
            if (typeof r.data.message === 'string') return `${head ? head + ': ' : ''}${r.data.message}`;
            try { return `${head ? head + ': ' : ''}${JSON.stringify(r.data).slice(0, 300)}`; } catch {}
          }
          if (head) return head;
        }
        try { return JSON.stringify(e); } catch {}
      }
      return 'Unknown error';
    } catch {
      return 'Unknown error';
    }
  };

  const authorizeTrade = async (proposal: NonNullable<ChatMessage['tradeProposal']>) => {
    try {
      if (!user?.id) return;
      // stop live polling during execution
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
      setIsLoading(true);

      // Final live refresh and order reprojection to live prices
      const symbols: { symbol: string; type: 'STOCK' | 'CRYPTO' }[] = [];
      proposal.orders.forEach((o) => {
        if (o.from.type !== 'CASH') symbols.push({ symbol: o.from.symbol, type: o.from.type });
        if (o.to.type !== 'CASH') symbols.push({ symbol: o.to.symbol, type: o.to.type });
      });
      const unique = Array.from(
        new Map(symbols.map((s) => [`${s.type}:${s.symbol.toUpperCase()}`, { symbol: s.symbol.toUpperCase(), type: s.type }])).values()
      );
      let latest: Record<string, { price: number | null; currency: string }> = {};
      try {
        const res = await fetch('/api/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: unique }),
        });
        if (res.ok) {
          const data = await res.json();
          latest = data.results || {};
        }
      } catch {}

      const adjustedOrders = proposal.orders.map((o) => {
        const fromKey = `${o.from.type}:${o.from.symbol.toUpperCase()}`;
        const toKey = `${o.to.type}:${o.to.symbol.toUpperCase()}`;
        const fromLive = o.from.type !== 'CASH' ? latest[fromKey]?.price ?? livePrices[fromKey]?.price ?? null : null;
        const toLive = o.to.type !== 'CASH' ? latest[toKey]?.price ?? livePrices[toKey]?.price ?? null : null;

        // Clone to avoid mutating original
        const next = JSON.parse(JSON.stringify(o));

        // BUY: USD -> Asset. Keep USD constant, recompute asset qty using live price.
        if (o.side === 'BUY' && o.from.type === 'CASH' && o.to.type !== 'CASH' && toLive) {
          const usd = o.from.amount;
          const qty = usd / toLive;
          next.to.amount = qty;
        }

        // SELL: Asset -> USD. Keep asset qty constant, recompute USD using live price.
        if (o.side === 'SELL' && o.to.type === 'CASH' && o.from.type !== 'CASH' && fromLive) {
          const qty = o.from.amount;
          const usd = qty * fromLive;
          next.to.amount = usd;
        }

        return next;
      });

      const res = await apiExecuteTradeOrders(user.id, adjustedOrders);
      const reply: ChatMessage = {
        role: 'assistant',
        content: res.success ? 'Transaction(s) executed successfully.' : `Failed: ${res.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);

      // Refresh server-side and local user context right after successful execution
      if (res.success) {
        try {
          const refreshed = await apiRefreshUserContext(user.id);
          setUserContext(refreshed);
          const now = new Date();
          setContextUpdatedAt(now);
          setContextJustUpdated(true);
          setTimeout(() => setContextJustUpdated(false), 2500);
          // Reset conversation context for the next user message so the model does not use prior chat
          setResetConversationOnNext(true);
        } catch (err) {
          console.warn('Could not refresh user context after trade:', err);
        }
      }
    } catch (e: any) {
      console.error('authorizeTrade error:', e);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Authorization failed.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Live price polling when a trade proposal is visible
  useEffect(() => {
    const last = messages.length > 0 ? messages[messages.length - 1] : undefined;
    const proposal = last?.tradeProposal;
    if (!proposal) {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
      return;
    }

    const symbols: { symbol: string; type: 'STOCK' | 'CRYPTO' }[] = [];
    proposal.orders.forEach((o) => {
      if (o.from.type !== 'CASH') symbols.push({ symbol: o.from.symbol, type: o.from.type });
      if (o.to.type !== 'CASH') symbols.push({ symbol: o.to.symbol, type: o.to.type });
    });
    // de-duplicate
    const unique = Array.from(new Map(symbols.map(s => [`${s.type}:${s.symbol.toUpperCase()}`, { symbol: s.symbol.toUpperCase(), type: s.type }])).values());

    const fetchOnce = async () => {
      try {
        const res = await fetch('/api/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: unique }),
        });
        if (!res.ok) return;
        const data = await res.json();
        setLivePrices(data.results || {});
        setLiveUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : new Date());
      } catch {}
    };

    // initial fetch and start interval
    fetchOnce();
    if (liveTimerRef.current) clearInterval(liveTimerRef.current as any);
    liveTimerRef.current = setInterval(fetchOnce, 5000);

    return () => {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    };
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg transition-all duration-300",
          isOpen && "bg-gray-600 hover:bg-gray-700 text-white"
        )}
        size="icon"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Overlay */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300",
            isExpanded
              ? "inset-6"
              : "bottom-24 right-6 w-96 h-[640px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)]"
          )}
        >
          <Card className="h-full flex flex-col bg-gray-900 border-2 border-yellow-500 shadow-2xl">
            <CardHeader className="relative flex-shrink-0 pb-3 border-b border-gray-700">
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <Bot size={20} />
                Hodlini - Your Crypto Bro
              </CardTitle>
              {/* Expand / Collapse control */}
              <button
                type="button"
                aria-label={isExpanded ? 'Shrink chat' : 'Expand chat'}
                onClick={() => setIsExpanded(v => !v)}
                className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-gray-800/60 border border-gray-700/60"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              {isLoadingContext && (
                <p className="text-xs text-gray-400 mt-1">
                  Loading your investment profile...
                </p>
              )}
              {userContext && !isLoadingContext && (
                <p
                  className={cn(
                    'text-xs mt-1 transition-colors',
                    contextJustUpdated ? 'text-green-300' : 'text-green-400'
                  )}
                >
                  ✓ Personalized context loaded
                  {contextUpdatedAt && (
                    <span className="text-[11px] text-green-300/80"> {" • updated "}{formatTime(contextUpdatedAt)}</span>
                  )}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                        <img 
                          src="/assets/characters/idle.gif" 
                          alt="Hodlini" 
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                    )}
                    
                    <MessageErrorBoundary>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.role === 'user'
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-700 text-gray-100"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{sanitizeForDisplay(message.content)}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </MessageErrorBoundary>
                    
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-yellow-900 text-xs font-bold">{user.name[0]}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                      <img 
                        src="/assets/characters/idle.gif" 
                        alt="Hodlini" 
                        className="w-6 h-6 object-cover"
                      />
                    </div>
                    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Render trade proposal card below the last assistant message if present */}
                {(() => {
                  const last = messages.length > 0 ? messages[messages.length - 1] : undefined;
                  const proposal = last?.tradeProposal;
                  return proposal ? (
                    <div className={cn(
                      "mt-2 rounded-lg border border-yellow-600/40 bg-gray-800/70 shadow-md",
                      isExpanded && "max-w-[26rem] mx-auto"
                    )}>
                      <div className="px-3 py-2 border-b border-gray-700 text-[11px] uppercase tracking-wide text-gray-300 flex items-center justify-between">
                        <span>Trade proposal for authorization</span>
                        <span className="text-[10px] font-medium text-green-400 flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          Live{liveUpdatedAt ? ` • updated ${formatTime(liveUpdatedAt)}` : ''}
                        </span>
                      </div>
                      <div className="divide-y divide-gray-700">
                        {proposal.orders.map((o, idx) => {
                          const fmtQty = (v: number, max = o.to.type === 'CRYPTO' || o.from.type === 'CRYPTO' ? 8 : 4) => {
                            if (!Number.isFinite(v)) return String(v);
                            const s = v.toFixed(max);
                            return s.replace(/\.0+$/, '').replace(/(\.[0-9]*?)0+$/, '$1');
                          };
                          const fmtUSD = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
                          const fromKey = `${o.from.type}:${o.from.symbol.toUpperCase()}`;
                          const toKey = `${o.to.type}:${o.to.symbol.toUpperCase()}`;
                          const fromLive = o.from.type !== 'CASH' ? livePrices[fromKey]?.price ?? null : null;
                          const toLive = o.to.type !== 'CASH' ? livePrices[toKey]?.price ?? null : null;

                          // Dynamically compute display amounts based on live prices
                          const display = (() => {
                            // Defaults to original proposal amounts
                            let fromAmount = o.from.amount;
                            let toAmount = o.to.amount;

                            if (o.side === 'BUY' && o.from.type === 'CASH') {
                              // USD -> Asset: keep USD spend constant; recompute asset qty from live to price
                              if (toLive && Number.isFinite(toLive)) {
                                toAmount = o.from.amount / toLive;
                              }
                            } else if (o.side === 'SELL' && o.to.type === 'CASH') {
                              // Asset -> USD: keep asset qty constant; recompute USD from live from price
                              if (fromLive && Number.isFinite(fromLive)) {
                                toAmount = o.from.amount * fromLive;
                              }
                            } else if (o.from.type !== 'CASH' && o.to.type !== 'CASH') {
                              // Asset -> Asset: estimate toAmount via live prices when both available
                              if (fromLive && toLive && Number.isFinite(fromLive) && Number.isFinite(toLive)) {
                                toAmount = o.from.amount * (fromLive / toLive);
                              }
                            }

                            // Compute bottom-right USD total dynamically
                            let bottomRightUSD: number | undefined = undefined;
                            if (o.side === 'BUY' && o.from.type === 'CASH') {
                              bottomRightUSD = o.from.amount; // locked spend
                            } else if (o.side === 'SELL' && o.to.type === 'CASH') {
                              if (fromLive && Number.isFinite(fromLive)) bottomRightUSD = o.from.amount * fromLive;
                              else bottomRightUSD = o.to.amount;
                            } else {
                              // Asset <-> Asset: show USD value of target leg if possible
                              if (toLive && Number.isFinite(toLive)) bottomRightUSD = toAmount * toLive;
                              else if (fromLive && Number.isFinite(fromLive)) bottomRightUSD = o.from.amount * fromLive;
                            }

                            return { fromAmount, toAmount, bottomRightUSD };
                          })();

                          return (
                            <div key={idx} className="p-3 grid grid-cols-[auto,1fr,auto,1fr,auto] items-stretch gap-2">
                              <div className={cn('self-start text-[10px] px-2 py-0.5 rounded-full font-semibold',
                                o.side === 'BUY' ? 'bg-green-600/20 text-green-300 border border-green-600/40' : 'bg-red-600/20 text-red-300 border border-red-600/40'
                              )}>
                                {o.side}
                              </div>
                              <div className="min-w-0 rounded-md border border-gray-700 bg-gray-900/60 p-2">
                                <div className="text-[10px] text-gray-400">From</div>
                                <div className="text-sm font-semibold text-gray-100 truncate">{o.from.symbol} <span className="text-[10px] opacity-70">({o.from.type})</span></div>
                                <div className="text-xs text-gray-300">Amount: {o.from.type === 'CASH' ? fmtUSD(display.fromAmount) : fmtQty(display.fromAmount)}</div>
                                {o.from.type !== 'CASH' && (
                                  <div className="text-[11px] text-gray-400 mt-0.5">Live price: {fromLive != null ? fmtUSD(fromLive) : '—'}</div>
                                )}
                              </div>
                              <div className="flex items-center justify-center text-gray-400 px-1">
                                <ArrowDown size={18} />
                              </div>
                              <div className="min-w-0 rounded-md border border-gray-700 bg-gray-900/60 p-2">
                                <div className="text-[10px] text-gray-400">To</div>
                                <div className="text-sm font-semibold text-gray-100 truncate">{o.to.symbol} <span className="text-[10px] opacity-70">({o.to.type})</span></div>
                                <div className="text-xs text-gray-300">Amount: {o.to.type === 'CASH' ? fmtUSD(display.toAmount) : fmtQty(display.toAmount)}</div>
                                {o.to.type !== 'CASH' && (
                                  <div className="text-[11px] text-gray-400 mt-0.5">Live price: {toLive != null ? fmtUSD(toLive) : '—'}</div>
                                )}
                              </div>
                              <div className="flex items-center justify-end text-sm font-medium text-gray-100 pl-2">
                                {display.bottomRightUSD !== undefined ? (
                                  // Use approximation glyph when value is live-derived and not locked
                                  (o.side === 'SELL' && o.to.type === 'CASH') || (o.from.type !== 'CASH' && o.to.type !== 'CASH') ? (
                                    <span className="whitespace-nowrap">≈ {fmtUSD(display.bottomRightUSD)}</span>
                                  ) : (
                                    <span className="whitespace-nowrap">{fmtUSD(display.bottomRightUSD)}</span>
                                  )
                                ) : (
                                  <span className="text-gray-500 text-xs">—</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 flex justify-end">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-60"
                          onClick={() => authorizeTrade(proposal)} disabled={isLoading}>
                          Authorize
                        </button>
                      </div>
                    </div>
                  ) : null;
                })()}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 flex gap-2 border-t border-gray-700 p-4 bg-gray-900">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about trading..."
                  className="flex-1 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIChatOverlay;