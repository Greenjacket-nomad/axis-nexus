import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type Article = Tables<'articles'>;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      
      // Try exact match first, then trimmed match if no result
      let { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      // If no exact match found, try with pattern matching for slugs with spaces
      if (!data && !fetchError) {
        const { data: trimmedData, error: trimmedError } = await supabase
          .from('articles')
          .select('*')
          .eq('is_active', true)
          .ilike('slug', `%${slug.trim()}%`)
          .limit(1)
          .maybeSingle();
        
        data = trimmedData;
        fetchError = trimmedError;
      }

      if (fetchError) throw fetchError;
      
      if (data) {
        setArticle(data);
        // Increment view count
        await supabase
          .from('articles')
          .update({ view_count: data.view_count + 1 })
          .eq('id', data.id);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-axis">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-primary-dark">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-axis">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
            <div className="max-w-4xl mx-auto text-center py-20">
              <h1 className="h1 mb-6">Article Not Found</h1>
              <p className="body-text mb-8">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/blog" className="btn-primary">
                Browse All Articles
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container-axis">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="default" className="bg-accent-primary text-white">
                  {article.category}
                </Badge>
                {article.featured && (
                  <Badge variant="secondary" className="bg-accent-hover text-primary-dark">
                    FEATURED
                  </Badge>
                )}
                <Badge variant="outline" className="text-text-muted border-border-color">
                  {article.industry}
                </Badge>
              </div>

              <h1 className="h1">{article.title}</h1>
              
              <p className="h3 text-text-muted font-light">
                {article.summary}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-text-body">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-accent-primary">By {article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(article.published_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{article.read_time} min read</span>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag size={18} className="text-accent-primary" />
                  {article.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-text-body border-border-color hover:bg-accent-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              <div 
                className="body-text leading-relaxed whitespace-pre-wrap"
                style={{ 
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
              >
                {article.content}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-border-color">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="small-text">
                    Published {new Date(article.published_date).toLocaleDateString()}
                  </span>
                  <span className="small-text">
                    {article.view_count} views
                  </span>
                </div>
                <Link 
                  to="/blog" 
                  className="btn-outline text-sm"
                >
                  More Articles
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;