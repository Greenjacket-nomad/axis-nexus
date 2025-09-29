import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatResponse, ArticleRecommendation } from '@/lib/api';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  articles?: ArticleRecommendation[];
  status?: 'success' | 'not_relevant' | 'no_results';
}

interface AIChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  retryLastMessage: () => Promise<void>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

interface AIChatProviderProps {
  children: ReactNode;
}

export const AIChatProvider: React.FC<AIChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const openChat = () => {
    setIsOpen(true);
    setError(null);
  };

  const closeChat = () => {
    setIsOpen(false);
    setError(null);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setLastUserMessage('');
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLastUserMessage(message);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const { apiClient } = await import('@/lib/api');
      const response = await apiClient.sendChatQuery(message);

      if (response.success && response.data) {
        const chatData = response.data;
        
        // Create AI response message
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: chatData.data.ai_answer,
          timestamp: new Date(),
          articles: chatData.data.recommended_articles,
          status: chatData.status,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        status: 'no_results',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = async () => {
    if (lastUserMessage) {
      // Remove the last AI message if it was an error
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.type === 'ai' && error) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      await sendMessage(lastUserMessage);
    }
  };

  return (
    <AIChatContext.Provider value={{
      isOpen,
      messages,
      isLoading,
      error,
      openChat,
      closeChat,
      sendMessage,
      clearChat,
      retryLastMessage,
    }}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};