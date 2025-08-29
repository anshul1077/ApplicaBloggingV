import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { blogPosts } from '@/data/blogPosts';
import { Filter } from 'lucide-react';

const Blog = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const initialPosts = blogPosts.map(post => ({ ...post, liked: false, likes_count: 0 }));
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Like/dislike handler
  const toggleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes_count: (post.liked ? (post.likes_count || 0) - 1 : (post.likes_count || 0) + 1) }
          : post
      )
    );
  };

  // Delete post handler
  const deletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  // Listen for openCreatePostForm event from Header
  React.useEffect(() => {
    const handler = () => setShowCreateForm(true);
    window.addEventListener('openCreatePostForm', handler);
    return () => window.removeEventListener('openCreatePostForm', handler);
  }, []);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.author) return;
    setPosts((prevPosts) => [
      {
        ...newPost,
        id: (Date.now()).toString(),
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        likes_count: 0,
        liked: false,
        date: new Date().toISOString().slice(0, 10),
        readTime: '1 min read',
        featured: false,
      },
      ...prevPosts
    ]);
    setNewPost({ title: '', excerpt: '', content: '', author: '', category: '', tags: '' });
    setShowCreateForm(false);
  };
  
  const categories = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Business'];
  
  // Get search query from URL
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search')?.toLowerCase() || '';

  // Filter posts by search query and category
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || post.category === selectedCategory;
    if (searchTerm) {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        (Array.isArray(post.tags) ? post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) : false);
      return matchesSearch && matchesCategory;
    }
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-subtle-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            All Articles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles on web development, programming, and technology.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (selectedCategory === '' && category === 'All') ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  className={selectedCategory === category || (selectedCategory === '' && category === 'All') ? "bg-hero-gradient" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Create Post Button & Form */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <Button variant="default" onClick={() => setShowCreateForm((v) => !v)}>
            {showCreateForm ? 'Cancel' : 'Create New Post'}
          </Button>
          {showCreateForm && (
            <form className="mt-6 grid gap-4 max-w-xl mx-auto bg-card p-6 rounded-lg shadow" onSubmit={handleCreatePost}>
              <Input placeholder="Title" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} required />
              <Input placeholder="Excerpt" value={newPost.excerpt} onChange={e => setNewPost(p => ({ ...p, excerpt: e.target.value }))} />
              <textarea className="border rounded p-2" placeholder="Content" value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} required />
              <Input placeholder="Author" value={newPost.author} onChange={e => setNewPost(p => ({ ...p, author: e.target.value }))} required />
              <Input placeholder="Category" value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))} />
              <Input placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))} />
              <Button type="submit" variant="default">Add Post</Button>
            </form>
          )}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : searchTerm && filteredPosts.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-primary">Your results are found</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => toggleLike(post.id)}
                    onDelete={() => deletePost(post.id)}
                  />
                ))}
              </div>
            </>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => toggleLike(post.id)}
                  onDelete={() => deletePost(post.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;