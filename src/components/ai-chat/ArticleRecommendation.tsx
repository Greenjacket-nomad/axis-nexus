import React from 'react';
import { Clock, ExternalLink, User, Tag } from 'lucide-react';
import { ArticleRecommendation as ArticleType } from '@/lib/api';

interface ArticleRecommendationProps {
  article: ArticleType;
}

export const ArticleRecommendation: React.FC<ArticleRecommendationProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="card-tech group">
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <a 
            href={article.article_url}
            className="h3 text-text-white hover:text-accent-primary transition-colors group-hover:text-accent-primary line-clamp-2"
          >
            {article.title}
          </a>
          <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0 ml-2" />
        </div>

        <div className="flex items-center gap-4 text-text-body small-text">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{article.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{article.read_time_minutes} min read</span>
          </div>
        </div>

        <p className="body-text text-text-muted line-clamp-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="small-text text-text-body">
            {formatDate(article.published_date)}
          </span>
          <a
            href={article.article_url}
            className="text-accent-primary hover:text-accent-hover transition-colors small-text font-medium"
          >
            Read article →
          </a>
        </div>
      </div>
    </div>
  );
};