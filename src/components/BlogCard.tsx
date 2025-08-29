import { Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/data/blogPosts";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <Card className={`group hover:shadow-hero transition-all duration-300 ${featured ? 'shadow-card' : ''}`}>
      {/* Banner Image Header */}
      <div
        className="w-full h-32 rounded-t-lg mb-[-1.5rem] bg-cover bg-center"
        style={{
          backgroundImage: `url(${post.bannerImage || '/public/placeholder.svg'})`,
        }}
      />
      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          {featured && (
            <Badge className="bg-hero-gradient text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <Link to={`/post/${post.id}`}>
          <h3 className={`font-bold group-hover:text-primary transition-colors ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;