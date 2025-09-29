import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2, X, Mail, MessageCircle, ExternalLink, ArrowLeft, Calendar, Clock, Tag, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArticleRecommendation } from '@/components/ai-chat/ArticleRecommendation';
import type { Tables } from '@/integrations/supabase/types';

type Article = Tables<'articles'>;

export const GlobalSubscriptionModal: React.FC = () => {
  const { 
    isOpen, 
    modalState, 
    prefilledData, 
    articles, 
    currentArticle, 
    questionResponse,
    isLoadingResponse,
    closeModal, 
    setModalState, 
    setArticles, 
    setCurrentArticle,
    setQuestionResponse,
    setIsLoadingResponse
  } = useSubscriptionModal();
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fullArticle, setFullArticle] = useState<Article | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const handleSubscribeYes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.submitSubscription({
        name: prefilledData.name,
        email: prefilledData.email,
        interest: prefilledData.interest,
        subscribed: true
      });
      
      if (response.success && response.data) {
        if (response.data.response) {
          setArticles(response.data.response);
        }
        setModalState('success');
        toast({
          title: "Success!",
          description: "You've been subscribed! Check your email for confirmation.",
        });
      } else {
        throw new Error(response.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeNo = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.submitSubscription({
        name: prefilledData.name,
        email: prefilledData.email,
        interest: prefilledData.interest,
        subscribed: false
      });
      
      if (response.success && response.data) {
        if (response.data.response) {
          setArticles(response.data.response);
        }
        setModalState('articles-only');
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadArticle = async (article: { id: number; title: string; summary: string; slug: string; }) => {
    setCurrentArticle(article);
    setModalState('reading-article');
    setArticleLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', article.slug.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (!data && !error) {
        // Try with pattern matching for slugs with spaces
        const { data: trimmedData, error: trimmedError } = await supabase
          .from('articles')
          .select('*')
          .eq('is_active', true)
          .ilike('slug', `%${article.slug.trim()}%`)
          .limit(1)
          .maybeSingle();
        
        if (trimmedData) {
          setFullArticle(trimmedData);
        } else {
          throw new Error('Article not found');
        }
      } else if (error) {
        throw error;
      } else {
        setFullArticle(data);
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      toast({
        title: "Error",
        description: "Failed to load article content.",
        variant: "destructive",
      });
      // Fall back to previous state
      setModalState(articles.length > 0 ? 'articles-only' : 'initial');
    } finally {
      setArticleLoading(false);
    }
  };

  const handleBackFromArticle = () => {
    setFullArticle(null);
    setCurrentArticle(null);
    // Return to the appropriate previous state
    setModalState(modalState === 'reading-article' ? 'articles-only' : 'initial');
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoadingResponse(true);
    try {
      const response = await apiClient.sendChatQuery(question);
      
      if (response.success && response.data) {
        setQuestionResponse(response.data);
        setModalState('question-response');
      } else {
        toast({
          title: "Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to send question:', error);
      toast({
        title: "Error", 
        description: "Failed to send question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const renderInitialState = () => (
    <div className="text-center space-y-6 p-6">
      <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-accent-primary" />
      </div>
      
      <div>
        <DialogTitle className="text-2xl font-bold text-text-white mb-2">
          Stay Updated with Personalized Insights
        </DialogTitle>
        <DialogDescription className="text-text-muted">
          Based on your interest in <span className="text-accent-primary font-medium">{prefilledData.interest}</span>, 
          we've curated content specifically for you.
        </DialogDescription>
      </div>
      
      <p className="text-lg text-text-white">
        Would you like to receive weekly insights tailored to your interests?
      </p>
      
      <div className="flex gap-4">
        <Button
          onClick={handleSubscribeYes}
          disabled={isLoading}
          className="flex-1 bg-accent-primary hover:bg-accent-hover text-text-white"
        >
          {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
          Yes, Subscribe Me
        </Button>
        <Button
          variant="outline"
          onClick={handleSubscribeNo}
          disabled={isLoading}
          className="flex-1 border-border-color text-text-muted hover:text-text-white hover:bg-secondary-dark"
        >
          No Thanks, Just Show Articles
        </Button>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-accent-primary" />
        </div>
        <div>
          <DialogTitle className="text-xl font-bold text-text-white mb-2">
            You're Subscribed!
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Check your email for confirmation and get ready for personalized insights about {prefilledData.interest}.
          </DialogDescription>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-white">Recommended Reading</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {articles.map((article) => (
              <div key={article.id} className="bg-secondary-dark p-4 border border-border-color">
                <h4 className="font-medium text-text-white mb-2">{article.title}</h4>
                <p className="text-sm text-text-muted mb-3 line-clamp-2">{article.summary}</p>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    className="text-accent-primary hover:text-accent-hover p-0 h-auto font-normal"
                    onClick={() => handleReadArticle(article)}
                  >
                    Read article
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-text-muted hover:text-accent-primary p-0 h-auto"
                    onClick={() => window.open(`/blog/${article.slug.trim()}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card-dark p-4 border border-accent-primary/20">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-accent-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-white mb-1">
              Have a question about {prefilledData.interest}?
            </h4>
            <p className="text-sm text-text-muted mb-3">
              Ask our AI assistant for personalized answers
            </p>
            <Button
              onClick={() => setModalState('ask-question')}
              variant="outline"
              size="sm"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-white"
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setModalState('ask-question')}
          variant="outline"
          className="flex-1 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-white"
        >
          Ask AI Assistant
        </Button>
        <Button
          onClick={() => setModalState('initial')}
          variant="outline"
          className="flex-1 border-border-color text-text-muted hover:text-text-white"
        >
          Back to Subscribe
        </Button>
        <Button
          onClick={closeModal}
          className="flex-1 bg-accent-primary hover:bg-accent-hover text-text-white"
        >
          Close
        </Button>
      </div>
    </div>
  );

  const renderArticlesOnlyState = () => (
    <div className="space-y-6 p-6">
      {articles.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <DialogTitle className="text-xl font-bold text-text-white mb-2">
              Recommended Articles
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              Here are some articles about {prefilledData.interest} you might find interesting.
            </DialogDescription>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {articles.map((article) => (
              <div key={article.id} className="bg-secondary-dark p-4 border border-border-color">
                <h4 className="font-medium text-text-white mb-2">{article.title}</h4>
                <p className="text-sm text-text-muted mb-3 line-clamp-2">{article.summary}</p>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    className="text-accent-primary hover:text-accent-hover p-0 h-auto font-normal"
                    onClick={() => handleReadArticle(article)}
                  >
                    Read article
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-text-muted hover:text-accent-primary p-0 h-auto"
                    onClick={() => window.open(`/blog/${article.slug.trim()}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card-dark p-4 border border-accent-primary/20">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-accent-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-white mb-1">
              Have a question about {prefilledData.interest}?
            </h4>
            <p className="text-sm text-text-muted mb-3">
              Ask our AI assistant for personalized answers
            </p>
            <Button
              onClick={() => setModalState('ask-question')}
              variant="outline"
              size="sm"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-white"
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={closeModal}
        className="w-full bg-accent-primary hover:bg-accent-hover text-text-white"
      >
        Close
      </Button>
    </div>
  );

  const renderArticleReader = () => {
    if (articleLoading) {
      return (
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackFromArticle}
              className="text-text-muted hover:text-text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-secondary-dark rounded w-3/4"></div>
              <div className="h-8 bg-secondary-dark rounded w-full"></div>
              <div className="h-4 bg-secondary-dark rounded w-5/6"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 bg-secondary-dark rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!fullArticle || !currentArticle) {
      return (
        <div className="space-y-6 p-6 text-center">
          <p className="text-text-muted">Article not found</p>
          <Button onClick={handleBackFromArticle} variant="outline">
            Back to Articles
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-card-dark pb-4 border-b border-border-color">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackFromArticle}
            className="text-text-muted hover:text-text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/blog/${fullArticle.slug.trim()}`, '_blank')}
            className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-white"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Full Article
          </Button>
        </div>

        <article className="space-y-4">
          <header className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-accent-primary text-white">
                {fullArticle.category}
              </Badge>
              {fullArticle.featured && (
                <Badge variant="secondary" className="bg-accent-hover text-primary-dark">
                  FEATURED
                </Badge>
              )}
            </div>

            <h1 className="text-lg font-bold text-text-white leading-tight">
              {fullArticle.title}
            </h1>
            
            <p className="text-sm text-text-muted leading-relaxed">
              {fullArticle.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-body">
              <span className="font-medium text-accent-primary">By {fullArticle.author}</span>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{new Date(fullArticle.published_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{fullArticle.read_time} min read</span>
              </div>
            </div>

            {fullArticle.tags && fullArticle.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-accent-primary" />
                {fullArticle.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs text-text-body border-border-color"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-sm prose-invert max-w-none">
            <div 
              className="text-sm text-text-body leading-relaxed whitespace-pre-wrap"
              style={{ lineHeight: '1.6' }}
            >
              {fullArticle.content.length > 1000 
                ? `${fullArticle.content.substring(0, 1000)}...` 
                : fullArticle.content
              }
            </div>
            {fullArticle.content.length > 1000 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => window.open(`/blog/${fullArticle.slug.trim()}`, '_blank')}
                className="text-accent-primary hover:text-accent-hover p-0 mt-2"
              >
                Read full article <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </article>
      </div>
    );
  };

  const renderAskQuestionState = () => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalState(articles.length > 0 ? 'success' : 'initial')}
            className="text-text-muted hover:text-text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-accent-primary" />
        </div>
        
        <div>
          <DialogTitle className="text-xl font-bold text-text-white mb-2">
            Ask AI Assistant
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Ask a question about {prefilledData.interest} and get personalized insights.
          </DialogDescription>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-white">Your Question</label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask anything about ${prefilledData.interest}...`}
            className="bg-secondary-dark border-border-color text-text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          />
        </div>
        
        <Button
          onClick={handleAskQuestion}
          disabled={!question.trim() || isLoadingResponse}
          className="w-full bg-accent-primary hover:bg-accent-hover text-text-white"
        >
          {isLoadingResponse ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Getting AI Response...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Ask Question
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderQuestionResponseState = () => {
    if (!questionResponse) return null;

    const getStatusMessage = () => {
      switch (questionResponse.status) {
        case 'not_relevant':
          return "I specialize in technology topics. Feel free to ask me about programming, software development, AI, or other tech-related subjects!";
        case 'no_results':
          return "I couldn't find specific articles about this topic in our knowledge base. Try asking about popular tech topics like React, AI, Python, or web development.";
        default:
          return null;
      }
    };

    return (
      <div className="space-y-6 p-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalState('ask-question')}
            className="text-text-muted hover:text-text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ask Another
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-text-white mb-2">AI Response</h3>
            {questionResponse.status === 'success' ? (
              <div className="bg-secondary-dark p-4 border border-border-color rounded-md">
                <p className="text-text-body leading-relaxed whitespace-pre-wrap">
                  {questionResponse.answer}
                </p>
              </div>
            ) : (
              <div className="bg-card-dark p-4 border border-accent-primary/20 rounded-md">
                <p className="text-text-muted">
                  {getStatusMessage()}
                </p>
              </div>
            )}
          </div>

          {questionResponse.status === 'success' && questionResponse.articles?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-text-white">Recommended Articles</h4>
              <div className="space-y-3">
                {questionResponse.articles.map((article) => (
                  <ArticleRecommendation key={article.article_id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              setQuestion('');
              setModalState('ask-question');
            }}
            variant="outline"
            className="flex-1 border-border-color text-text-muted hover:text-text-white"
          >
            Ask Another Question
          </Button>
          <Button
            onClick={closeModal}
            className="flex-1 bg-accent-primary hover:bg-accent-hover text-text-white"
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg bg-card-dark border-accent-primary/20 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Subscription Modal</DialogTitle>
        </DialogHeader>
        
        {modalState === 'initial' && renderInitialState()}
        {modalState === 'success' && renderSuccessState()}
        {modalState === 'articles-only' && renderArticlesOnlyState()}
        {modalState === 'reading-article' && renderArticleReader()}
        {modalState === 'ask-question' && renderAskQuestionState()}
        {modalState === 'question-response' && renderQuestionResponseState()}
      </DialogContent>
    </Dialog>
  );
};