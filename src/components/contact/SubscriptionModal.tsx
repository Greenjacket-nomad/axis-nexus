import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Check, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api';
import { validateSubscriptionForm, SubscriptionFormData, ValidationErrors } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedData: {
    name: string;
    email: string;
    interest: string;
  };
}

const interestOptions = [
  'Choose One',
  'Quantum Computing',
  'Web3',
  'Robotics',
  'Artificial Intelligence',
  'Space Exploration'
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  recommendedData
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: recommendedData.name || '',
    email: recommendedData.email || '',
    interest: recommendedData.interest || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateSubscriptionForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.submitSubscription({
        email: formData.email,
        interests: [formData.interest]
      });

      if (response.success) {
        setSubmitted(true);
        toast({
          title: "Success!",
          description: "You've been successfully subscribed to our newsletter.",
        });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({ name: '', email: '', interest: '' });
        }, 2000);
      } else {
        throw new Error(response.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setErrors({ form: 'Failed to subscribe. Please try again.' });
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitted(false);
      setErrors({});
    }
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card-dark border-accent-primary/20">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-accent-primary" />
            </div>
            <DialogTitle className="h3 mb-2">Successfully Subscribed!</DialogTitle>
            <DialogDescription className="text-text-muted">
              You'll receive updates about {formData.interest} and other tech innovations.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card-dark border-accent-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="h3">Stay Updated</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-6 w-6 text-text-muted hover:text-text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-text-muted">
            Get the latest insights about {recommendedData.interest} and other emerging technologies.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="sub-name" className="block text-sm font-medium text-text-white mb-2">
              Name *
            </label>
            <Input
              id="sub-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`bg-primary-dark border-border-color text-text-white ${
                errors.name ? 'border-destructive' : ''
              }`}
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="sub-email" className="block text-sm font-medium text-text-white mb-2">
              Email *
            </label>
            <Input
              id="sub-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-primary-dark border-border-color text-text-white ${
                errors.email ? 'border-destructive' : ''
              }`}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="sub-interest" className="block text-sm font-medium text-text-white mb-2">
              Primary Interest *
            </label>
            <select
              id="sub-interest"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors appearance-none cursor-pointer ${
                errors.interest ? 'border-destructive' : ''
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
              disabled={isSubmitting}
            >
              {interestOptions.map((option, index) => (
                <option 
                  key={option} 
                  value={index === 0 ? '' : option}
                  disabled={index === 0}
                  className="bg-primary-dark text-text-white"
                >
                  {option}
                </option>
              ))}
            </select>
            {errors.interest && (
              <p className="text-destructive text-sm mt-1">{errors.interest}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-border-color text-text-muted hover:text-text-white"
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent-primary text-text-white hover:bg-accent-hover"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};