import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export const usePosts = (userId?: string, published?: boolean) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [userId, published, user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (published !== undefined) {
        query = query.eq('published', published);
      } else if (!userId) {
        // Only show published posts for public feed
        query = query.eq('published', true);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Fetch profiles, likes and comments count for each post
      const postsWithStats = await Promise.all(
        (postsData || []).map(async (post) => {
          const [profileResult, likesResult, commentsResult, userLikeResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('username, display_name, avatar_url')
              .eq('user_id', post.user_id)
              .maybeSingle(),
            supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id),
            supabase
              .from('comments')
              .select('id')
              .eq('post_id', post.id),
            user ? supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle() : { data: null }
          ]);

          return {
            ...post,
            profiles: profileResult.data,
            likes_count: likesResult.data?.length || 0,
            comments_count: commentsResult.data?.length || 0,
            is_liked: userLikeResult?.data ? true : false
          };
        })
      );

      setPosts(postsWithStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<Post, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...postData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      await fetchPosts(); // Refresh posts
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      await fetchPosts(); // Refresh posts
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchPosts(); // Refresh posts
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: user.id }]);
      }

      await fetchPosts(); // Refresh posts
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    refetch: fetchPosts
  };
};