'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '@/lib/actions/chat.actions';
import { getUserContext } from '@/lib/actions/user-context.actions';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user context when chat opens
  useEffect(() => {
    if (isOpen && !userContext && !isLoadingContext) {
      setIsLoadingContext(true);
      getUserContext(user.id)
        .then((context) => {
          setUserContext(context);
        })
        .catch((error) => {
          console.error('Error fetching user context:', error);
        })
        .finally(() => {
          setIsLoadingContext(false);
        });
    }
  }, [isOpen, user.id, userContext, isLoadingContext]);

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
      const assistantMessage = await sendChatMessage(updatedMessages, userContext);
      
      if (assistantMessage) {
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        // Add error message if API call fails
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date(),
        };
        setMessages([...updatedMessages, errorMessage]);
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
                <p className="text-xs text-green-400 mt-1">
                  ✓ Personalized context loaded
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