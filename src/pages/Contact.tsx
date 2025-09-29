import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MapPin, Phone, Loader2, AlertCircle, Check, CheckCircle } from 'lucide-react';
import { apiClient, N8nContactResponse } from '@/lib/api';
import { validateContactForm, ContactFormData, ValidationErrors, ErrorType } from '@/lib/validation';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Contact() {
  const { toast } = useToast();
  const { openModal } = useSubscriptionModal();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [n8nResponse, setN8nResponse] = useState<N8nContactResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    // Validate form data
    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please check the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.submitContact(formData);
      
      if (response.success && response.data) {
        setSubmitted(true);
        setN8nResponse(response.data);
        
        toast({
          title: "Message Sent!",
          description: "Your message has been submitted successfully. We'll get back to you soon.",
        });

        // Automatically open subscription modal with pre-filled data
        if (response.data.showSubscribePrompt) {
          setTimeout(() => {
            openModal({
              name: formData.name,
              email: formData.email,
              interest: formData.interest
            });
          }, 1500);
        }
        
        setFormData({ name: '', email: '', subject: '', interest: '', message: '' });
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err.errorType) {
        switch (err.errorType) {
          case ErrorType.TIMEOUT:
            errorMessage = 'Request timed out. Please check your connection and try again.';
            break;
          case ErrorType.AUTHENTICATION:
            errorMessage = 'Authentication failed. Please contact support.';
            break;
          case ErrorType.NETWORK:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case ErrorType.SERVER:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
      }
      
      setErrors({ form: errorMessage });
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary-dark">
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="container-axis">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-accent-primary" />
              </div>
              <h1 className="h1 mb-6">Thank You!</h1>
              <p className="body-text mb-8 max-w-2xl mx-auto">
                Your message has been sent successfully and stored securely. 
                {n8nResponse?.status && ` Status: ${n8nResponse.status}.`}
                {' '}We'll get back to you within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    setN8nResponse(null);
                  }}
                  className="btn-primary"
                >
                  Send Another Message
                </Button>
                {n8nResponse?.showSubscribePrompt && (
                  <Button 
                    onClick={() => openModal({
                      name: formData.name || '',
                      email: formData.email || '',
                      interest: formData.interest || ''
                    })}
                    variant="outline"
                    className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-white"
                  >
                    Subscribe for Updates
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="section-spacing pt-32">
        <div className="container-axis">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="h1">Get In Touch</h1>
            <p className="body-text max-w-2xl mx-auto">
              Have a project in mind or want to discuss technology solutions? 
              We'd love to hear from you. Let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-axis">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="h2 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="text-accent-primary mt-1" size={20} />
                    <div>
                      <h3 className="h3 mb-2">Email</h3>
                      <p className="body-text">hello@axismundi.dev</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="text-accent-primary mt-1" size={20} />
                    <div>
                      <h3 className="h3 mb-2">Phone</h3>
                      <p className="body-text">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="text-accent-primary mt-1" size={20} />
                    <div>
                      <h3 className="h3 mb-2">Location</h3>
                      <p className="body-text">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-dark p-6">
                <h3 className="h3 mb-4">Why Work With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-accent-primary mt-0.5" size={16} />
                    <span className="body-text">Expert technical consultation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-accent-primary mt-0.5" size={16} />
                    <span className="body-text">Cutting-edge technology solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-accent-primary mt-0.5" size={16} />
                    <span className="body-text">24/7 support and maintenance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-accent-primary mt-0.5" size={16} />
                    <span className="body-text">Agile development process</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card-dark p-8 md:p-12 border border-border-color">
              <h2 className="h2 mb-8">Send us a message</h2>
              
              {errors.form && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.form}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block h3 mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`bg-primary-dark text-text-white border-border-color focus:border-accent-primary ${
                        errors.name ? 'border-destructive' : ''
                      }`}
                      placeholder="Your full name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block h3 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`bg-primary-dark text-text-white border-border-color focus:border-accent-primary ${
                        errors.email ? 'border-destructive' : ''
                      }`}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block h3 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`bg-primary-dark text-text-white border-border-color focus:border-accent-primary ${
                      errors.subject ? 'border-destructive' : ''
                    }`}
                    placeholder="What's this about?"
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="text-destructive text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="interest" className="block h3 mb-2">
                    Area of Interest *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors appearance-none cursor-pointer ${
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
                    <option value="" disabled className="bg-primary-dark text-text-muted">
                      Choose One
                    </option>
                    <option value="Quantum Computing" className="bg-primary-dark text-text-white">
                      Quantum Computing
                    </option>
                    <option value="Web3" className="bg-primary-dark text-text-white">
                      Web3
                    </option>
                    <option value="Robotics" className="bg-primary-dark text-text-white">
                      Robotics
                    </option>
                    <option value="Artificial Intelligence" className="bg-primary-dark text-text-white">
                      Artificial Intelligence
                    </option>
                    <option value="Space Exploration" className="bg-primary-dark text-text-white">
                      Space Exploration
                    </option>
                  </select>
                  {errors.interest && (
                    <p className="text-destructive text-sm mt-1">{errors.interest}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block h3 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`bg-primary-dark text-text-white border-border-color focus:border-accent-primary resize-vertical ${
                      errors.message ? 'border-destructive' : ''
                    }`}
                    placeholder="Tell us about your project, ideas, or questions..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-primary text-text-white hover:bg-accent-hover transition-all duration-300 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}