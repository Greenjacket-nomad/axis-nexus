import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type Article = Tables<'articles'>;

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticlesAndCategories();
  }, []);

  const fetchArticlesAndCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_active', true)
        .order('published_date', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch unique categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('articles')
        .select('category')
        .eq('is_active', true);

      if (categoriesError) throw categoriesError;

      const uniqueCategories = Array.from(
        new Set(categoriesData?.map(item => item.category) || [])
      ).sort();

      setArticles(articlesData || []);
      setCategories(['All', ...uniqueCategories]);
      setError(null);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

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
          {loading ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
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
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container-axis">
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive body-text">{error}</p>
              <button 
                onClick={fetchArticlesAndCategories}
                className="btn-primary mt-4"
              >
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card-dark p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="body-text">No articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className={`group block transition-all duration-300 hover:scale-105 ${
                    article.featured ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <article className="bg-card-dark p-6 h-full hover:shadow-2xl transition-shadow duration-300">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="default" className="bg-accent-primary text-white text-xs">
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="secondary" className="bg-accent-hover text-primary-dark text-xs">
                          FEATURED
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className={`${article.featured ? 'h2' : 'h3'} group-hover:text-accent-hover transition-colors`}>
                        {article.title}
                      </h3>
                      
                      <p className="body-text">
                        {article.summary}
                      </p>

                      {/* Author */}
                      <p className="small-text text-accent-primary">
                        By {article.author}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-text-body text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(article.published_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{article.read_time} min read</span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-accent-primary group-hover:text-accent-hover transition-colors">
                        <span className="font-medium">Read More</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
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