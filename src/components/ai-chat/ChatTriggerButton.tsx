import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';
import { Button } from '@/components/ui/button';

interface ChatTriggerButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
  children?: React.ReactNode;
}

export const ChatTriggerButton: React.FC<ChatTriggerButtonProps> = ({
  variant = 'inline',
  className = '',
  children,
}) => {
  const { openChat } = useAIChat();

  if (variant === 'floating') {
    return (
      <button
        onClick={openChat}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-accent-primary hover:bg-accent-hover text-text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${className}`}
        aria-label="Open AI Chat Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Button
      onClick={openChat}
      className={`bg-accent-primary hover:bg-accent-hover text-text-white transition-all duration-300 ${className}`}
    >
      {children || (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask a Question
        </>
      )}
    </Button>
  );
};