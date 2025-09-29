import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiClient } from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await apiClient.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Contact form submission error:', err);
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
              <CheckCircle size={64} className="text-accent-primary mx-auto" />
              <h1 className="h2">Message Sent!</h1>
              <p className="body-text">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
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
            <div>
              <div className="bg-card-dark p-8">
                <h2 className="h2 mb-6">Send us a message</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500 text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block h3 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block h3 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block h3 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block h3 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary transition-colors resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;