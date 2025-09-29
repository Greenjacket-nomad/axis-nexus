import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, RotateCcw, Loader2 } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AIChatModal: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    error,
    closeChat,
    sendMessage,
    clearChat,
    retryLastMessage,
  } = useAIChat();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    closeChat();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary-dark/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4 bg-card-dark border border-border-color shadow-xl flex flex-col md:h-auto md:min-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color bg-secondary-dark">
          <div className="flex-1">
            <h2 className="h2">Ask Our AI Assistant</h2>
            <p className="small-text text-text-muted mt-1">
              Get personalized answers about technology and innovation
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-text-muted hover:text-accent-primary"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-text-muted hover:text-accent-primary"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-accent-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-accent-primary" />
              </div>
              <h3 className="h3 mb-2">Start a Conversation</h3>
              <p className="body-text text-text-muted max-w-md mx-auto">
                Ask me anything about quantum computing, artificial intelligence, blockchain technology, or other innovation topics!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
              articles={message.articles}
              status={message.status}
            />
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] bg-card-dark border border-border-color p-4 shadow-md">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                  <span className="body-text text-text-muted">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 text-center">
              <p className="body-text text-destructive mb-3">{error}</p>
              <Button
                onClick={retryLastMessage}
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive hover:text-text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border-color bg-secondary-dark">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about quantum computing or technology..."
              disabled={isLoading}
              className="flex-1 bg-card-dark border-border-color text-text-white placeholder:text-text-body focus:border-accent-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-accent-primary hover:bg-accent-hover text-text-white px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-text-body small-text">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Escape to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};