import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blogPosts";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-16">
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Badge variant="secondary">{post.category}</Badge>
            {post.featured && (
              <Badge className="bg-hero-gradient text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Tags and Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Related Posts Call-to-Action */}
        <footer className="mt-16 pt-8 border-t">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discover more insights and tutorials in our blog.
            </p>
            <Button asChild className="bg-hero-gradient">
              <Link to="/blog">Explore More Articles</Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default Post;