import { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "The Future of AI in Software Development",
    excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and maintain software applications.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "AI & Technology",
    featured: true
  },
  {
    id: 2,
    title: "Building Scalable Microservices Architecture",
    excerpt: "Best practices and patterns for designing distributed systems that can handle massive scale.",
    date: "2024-01-10",
    readTime: "12 min read", 
    category: "Architecture"
  },
  {
    id: 3,
    title: "Modern JavaScript Frameworks Comparison",
    excerpt: "A comprehensive analysis of React, Vue, and Angular in 2024 - which one should you choose?",
    date: "2024-01-05",
    readTime: "15 min read",
    category: "Frontend"
  },
  {
    id: 4,
    title: "DevOps Best Practices for Startups",
    excerpt: "Essential DevOps practices that every startup should implement from day one.",
    date: "2023-12-28",
    readTime: "10 min read",
    category: "DevOps"
  },
  {
    id: 5,
    title: "Database Design Patterns for High Performance",
    excerpt: "Advanced database optimization techniques for handling millions of concurrent users.",
    date: "2023-12-20",
    readTime: "14 min read",
    category: "Database"
  },
  {
    id: 6,
    title: "Cybersecurity in the Age of Remote Work",
    excerpt: "Essential security measures for protecting distributed teams and remote infrastructure.",
    date: "2023-12-15",
    readTime: "9 min read",
    category: "Security"
  }
];

const CATEGORIES = ["All", "AI & Technology", "Architecture", "Frontend", "DevOps", "Database", "Security"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? SAMPLE_POSTS 
    : SAMPLE_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container-axis">
          <div className="text-center space-y-6">
            <h1 className="h1">Technology Insights</h1>
            <p className="body-text max-w-2xl mx-auto">
              Explore cutting-edge technology topics, best practices, and insights 
              from the world of software development and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="container-axis">
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-accent-primary text-white'
                    : 'bg-card-dark text-text-muted hover:bg-secondary-dark hover:text-accent-hover'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container-axis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                  post.featured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="bg-card-dark p-6 h-full hover:shadow-2xl transition-shadow duration-300">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-accent-primary text-white text-xs font-medium">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-3 py-1 bg-accent-hover text-primary-dark text-xs font-medium">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className={`${post.featured ? 'h2' : 'h3'} group-hover:text-accent-hover transition-colors`}>
                      {post.title}
                    </h3>
                    
                    <p className="body-text">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-text-body text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-accent-primary group-hover:text-accent-hover transition-colors">
                      <span className="font-medium">Read More</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-secondary-dark">
        <div className="container-axis">
          <div className="text-center space-y-6">
            <h2 className="h2">Stay Updated</h2>
            <p className="body-text max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest technology insights and tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-dark text-text-white border border-border-color focus:outline-none focus:border-accent-primary"
              />
              <button className="btn-primary px-8">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;