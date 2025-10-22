'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User, ArrowRight, ArrowDown } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '@/lib/actions/chat.actions';
import { getUserContext, refreshUserContext } from '@/lib/actions/user-context.actions';
import { runAIContextAgent } from '@/lib/actions/ai-agent.actions';
import { decideTrades, executeTradeOrders } from '../lib/actions/ai-trade-agent.actions';
import { cn } from '@/lib/utils';

interface AIChatOverlayProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  const contextLoadedRef = useRef(false); // Track if context was loaded this session
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    getUserContext(user.id)
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
        content: 'Hello! I\'m Hodlini, your personal crypto assistant. 🚀\n\nI help you make the transition from traditional stocks to cryptocurrencies by recommending coins that match the themes of your stock investments.\n\nFeel free to ask me about crypto recommendations, portfolio strategies, or anything related to trading!',
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
      // Always fetch the latest user context before processing the message
      let freshContext: string | null = userContext;
      try {
        const latest = await getUserContext(user.id);
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
        const result = await runAIContextAgent(
          updatedMessages.map(m => ({ role: m.role, content: m.content })),
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
        const maybeProposal = await decideTrades(userMessage.content, freshContext, priceContext ?? undefined);
        if (maybeProposal && maybeProposal.orders?.length) {
          const assistantTrade: ChatMessage = {
            role: 'assistant',
            content: 'Trade proposal ready. Please review and authorize.',
            timestamp: new Date(),
            tradeProposal: maybeProposal,
          };
          setMessages(prev => [...prev, assistantTrade]);
          return;
        }
      } catch (e) {
        console.error('decideTrades failed:', e);
      }

      // Step 3: Fallback to plain chat if no assistant response was added yet
      if (!assistantAdded) {
  const assistantMessage = await sendChatMessage(updatedMessages, freshContext);
        if (assistantMessage) {
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again later.',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
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

  const authorizeTrade = async (proposal: NonNullable<ChatMessage['tradeProposal']>) => {
    try {
      if (!user?.id) return;
      setIsLoading(true);
      const res = await executeTradeOrders(user.id, proposal.orders);
      const reply: ChatMessage = {
        role: 'assistant',
        content: res.success ? 'Transaction(s) executed successfully.' : `Failed: ${res.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);

      // Refresh server-side and local user context right after successful execution
      if (res.success) {
        try {
          const refreshed = await refreshUserContext(user.id);
          setUserContext(refreshed);
          const now = new Date();
          setContextUpdatedAt(now);
          setContextJustUpdated(true);
          setTimeout(() => setContextJustUpdated(false), 2500);
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
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]">
          <Card className="h-full flex flex-col bg-gray-900 border-2 border-yellow-500 shadow-2xl">
            <CardHeader className="flex-shrink-0 pb-3 border-b border-gray-700">
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <Bot size={20} />
                Hodlini - Your Crypto Bro
              </CardTitle>
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
                    
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.role === 'user'
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-700 text-gray-100"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    
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
                    <div className="mt-2 rounded-lg border border-yellow-600/40 bg-gray-800/70 shadow-md">
                      <div className="px-3 py-2 border-b border-gray-700 text-[11px] uppercase tracking-wide text-gray-300">
                        Trade proposal for authorization
                      </div>
                      <div className="divide-y divide-gray-700">
                        {proposal.orders.map((o, idx) => {
                          const totalUSD = o.from.type === 'CASH' ? o.from.amount : (o.to.type === 'CASH' ? o.to.amount : undefined);
                          const fmtQty = (v: number, max = o.to.type === 'CRYPTO' || o.from.type === 'CRYPTO' ? 8 : 4) => {
                            if (!Number.isFinite(v)) return String(v);
                            const s = v.toFixed(max);
                            return s.replace(/\.0+$/, '').replace(/(\.[0-9]*?)0+$/, '$1');
                          };
                          const fmtUSD = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
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
                                <div className="text-xs text-gray-300">Amount: {fmtQty(o.from.amount)}</div>
                              </div>
                              <div className="flex items-center justify-center text-gray-400 px-1">
                                <ArrowDown size={18} />
                              </div>
                              <div className="min-w-0 rounded-md border border-gray-700 bg-gray-900/60 p-2">
                                <div className="text-[10px] text-gray-400">To</div>
                                <div className="text-sm font-semibold text-gray-100 truncate">{o.to.symbol} <span className="text-[10px] opacity-70">({o.to.type})</span></div>
                                <div className="text-xs text-gray-300">Amount: {fmtQty(o.to.amount)}</div>
                              </div>
                              <div className="flex items-center justify-end text-sm font-medium text-gray-100 pl-2">
                                {typeof totalUSD === 'number' ? <span className="whitespace-nowrap">{fmtUSD(totalUSD)}</span> : <span className="text-gray-500 text-xs">—</span>}
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