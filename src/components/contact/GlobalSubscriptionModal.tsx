import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2, X, Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const GlobalSubscriptionModal: React.FC = () => {
  const { 
    isOpen, 
    modalState, 
    prefilledData, 
    articles,
    closeModal, 
    setModalState, 
    setArticles 
  } = useSubscriptionModal();
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
                <Button
                  variant="link"
                  className="text-accent-primary hover:text-accent-hover p-0 h-auto font-normal"
                  onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                >
                  Read article <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
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
                <Button
                  variant="link"
                  className="text-accent-primary hover:text-accent-hover p-0 h-auto font-normal"
                  onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                >
                  Read article <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
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

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg bg-card-dark border-accent-primary/20 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Subscription Modal</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 h-6 w-6 text-text-muted hover:text-text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {modalState === 'initial' && renderInitialState()}
          {modalState === 'success' && renderSuccessState()}
          {modalState === 'articles-only' && renderArticlesOnlyState()}
        </div>
      </DialogContent>
    </Dialog>
  );
};