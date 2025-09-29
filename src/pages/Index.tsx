import { ArrowRight, Zap, Shield, Cpu, Rocket, Brain, Network } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import heroImage from '@/assets/hero-tech-bg.jpg';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Harness the power of artificial intelligence to unlock deeper understanding and predictive analytics."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security protocols ensure your data remains protected at every level of interaction."
    },
    {
      icon: Network,
      title: "Seamless Integration",
      description: "Connect with existing systems through robust APIs and webhook-based automation workflows."
    },
    {
      icon: Rocket,
      title: "Rapid Deployment",
      description: "Get up and running in minutes with our streamlined onboarding and configuration process."
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description: "Leverage distributed computing power for lightning-fast processing and real-time responses."
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Intelligent workflows that adapt and optimize based on usage patterns and performance metrics."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "10ms", label: "Average Response" },
    { value: "1M+", label: "API Calls Daily" },
    { value: "24/7", label: "Expert Support" }
  ];

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Futuristic technology background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container-axis text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="h1 mb-6">
              The Future of 
              <span className="text-gradient block">Technology Integration</span>
            </h1>
            <p className="body-text text-xl mb-8 max-w-2xl mx-auto">
              Axis Mundi bridges the gap between innovation and implementation, 
              delivering cutting-edge solutions that transform how businesses 
              interact with technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-hero group">
                Explore Solutions
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent-primary animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent-hover animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-accent-glow animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="section-padding border-b border-secondary-dark">
        <div className="container-axis">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="h2 text-gradient mb-2">{stat.value}</div>
                <div className="small-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-axis">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4">
              Engineered for 
              <span className="text-gradient">Excellence</span>
            </h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              Our platform combines advanced automation, AI-driven insights, 
              and enterprise-grade security to deliver unparalleled performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-tech group">
                <div className="w-12 h-12 bg-gradient-primary mb-4 flex items-center justify-center group-hover:animate-glow">
                  <feature.icon size={25} className="text-white" />
                </div>
                <h3 className="h3 text-white mb-3">{feature.title}</h3>
                <p className="body-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-card-dark">
        <div className="container-axis text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="h2 mb-4">
              Ready to Transform Your 
              <span className="text-gradient">Digital Infrastructure?</span>
            </h2>
            <p className="body-text text-lg mb-8">
              Join forward-thinking organizations that trust Axis Mundi 
              to power their technological evolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero">
                Start Your Journey
              </button>
              <button className="btn-outline">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
