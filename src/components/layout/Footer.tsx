import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { APP_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Twitter: Twitter,
  };

  return (
    <footer className="bg-card-dark border-t border-secondary-dark">
      <div className="container-axis py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary"></div>
              <span className="h3 text-white">{APP_CONFIG.name}</span>
            </div>
            <p className="body-text mb-6">
              {APP_CONFIG.description}. Exploring the intersection of technology, 
              innovation, and human potential through insightful analysis and 
              forward-thinking perspectives.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link) => {
                const IconComponent = socialIcons[link.name as keyof typeof socialIcons];
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-text-muted hover:text-accent-hover transition-colors p-2"
                    aria-label={link.name}
                  >
                    {IconComponent && <IconComponent size={20} />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="h3 text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="body-text hover:text-accent-hover transition-colors">Home</a></li>
              <li><a href="/blog" className="body-text hover:text-accent-hover transition-colors">Blog</a></li>
              <li><a href="/projects" className="body-text hover:text-accent-hover transition-colors">Projects</a></li>
              <li><a href="/contact" className="body-text hover:text-accent-hover transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="h3 text-white mb-4">Stay Updated</h4>
            <p className="body-text mb-4">
              Get the latest insights delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-secondary-dark border border-border-color 
                         text-text-muted placeholder-text-body focus:outline-none 
                         focus:border-accent-primary transition-colors"
              />
              <button className="btn-primary px-4">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-dark mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="small-text">
            © {currentYear} {APP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="small-text hover:text-accent-hover transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="small-text hover:text-accent-hover transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;