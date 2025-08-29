import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Calendar, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/hooks/usePosts';
import { BlogPost } from '@/data/blogPosts';
import { useAuth } from '@/contexts/AuthContext';

type PostCardProps = {
  post: Post | BlogPost;
  onLike?: (postId: string) => void;
  onEdit?: (post: Post | BlogPost) => void;
  onDelete?: (postId: string) => void;
  isOwner?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onEdit, onDelete, isOwner }) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card className="group hover:shadow-glow transition-shadow duration-300 bg-card border-border/50">
      {('featured_image' in post && post.featured_image) ? (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image as string}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : ('bannerImage' in post && post.bannerImage) ? (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.bannerImage as string}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : null}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {('profiles' in post && post.profiles) ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {post.profiles?.display_name?.[0] || post.profiles?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {post.profiles?.display_name || post.profiles?.username}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate((post as BlogPost).date)}</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {(post as BlogPost).author}
                </p>
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(post)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(post.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Link to={`/post/${post.id}`} className="group">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {post.excerpt || getExcerpt(post.content)}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          {post.tags && post.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline">#{tag}</Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-end pt-2 border-t border-border">
          <Link to={`/post/${post.id}`}>
            <Button variant="outline" size="sm">
              Read More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;