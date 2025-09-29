import React from 'react';
import { Copy, Check } from 'lucide-react';
import { ArticleRecommendation } from './ArticleRecommendation';
import { ArticleRecommendation as ArticleType } from '@/lib/api';

interface ChatMessageProps {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  articles?: ArticleType[];
  status?: 'success' | 'not_relevant' | 'no_results';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp,
  articles,
  status,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'not_relevant':
        return "I specialize in technology and innovation topics. Try asking about AI, quantum computing, blockchain, or other tech innovations!";
      case 'no_results':
        return "I couldn't find specific articles about that topic in our knowledge base. However, I'd be happy to help you with questions about artificial intelligence, quantum computing, blockchain technology, cybersecurity, fintech, or other technology and innovation topics.";
      default:
        return content;
    }
  };

  const displayContent = status && status !== 'success' ? getStatusMessage(status) : content;

  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-accent-primary text-text-white p-4 shadow-md">
          <p className="body-text text-text-white">{content}</p>
          <span className="small-text text-accent-light block mt-2 opacity-75">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-6">
      <div className="max-w-[90%] bg-card-dark border border-border-color p-4 shadow-md">
        <div className="flex items-start justify-between mb-2">
          <h4 className="h3 text-accent-primary mb-3">AI Assistant</h4>
          <button
            onClick={copyToClipboard}
            className="text-text-muted hover:text-accent-primary transition-colors p-1"
            aria-label="Copy response"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="body-text whitespace-pre-wrap">{displayContent}</p>
        </div>
        
        <span className="small-text text-text-body block mt-3 opacity-75">
          {formatTime(timestamp)}
        </span>
      </div>

      {articles && articles.length > 0 && status === 'success' && (
        <div className="mt-4 max-w-[90%]">
          <h4 className="h3 text-accent-primary mb-3">Related Articles</h4>
          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleRecommendation key={article.article_id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};