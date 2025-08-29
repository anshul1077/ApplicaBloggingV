import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import { blogPosts } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Featured Articles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked stories covering the latest in web development, programming, and technology trends.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Recent Posts</h2>
              <p className="text-muted-foreground">
                Stay updated with our latest insights and tutorials.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/blog" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
