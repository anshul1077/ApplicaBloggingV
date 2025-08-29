import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, Menu, X, User, LogOut, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleHeaderSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-hero-gradient h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-primary">BlogBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors hover:text-primary ${
                isActive("/") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`transition-colors hover:text-primary ${
                isActive("/blog") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Search and Auth Actions */}
          <div className="flex items-center space-x-4">
            <form className="hidden sm:flex items-center space-x-2" onSubmit={handleHeaderSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="default">Search</Button>
            </form>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    onClick={() => {
                      if (location.pathname !== '/blog') {
                        navigate('/blog', { state: { openCreate: true } });
                      } else {
                        window.dispatchEvent(new CustomEvent('openCreatePostForm'));
                      }
                    }}
                    variant="outline" 
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {profile?.display_name?.[0] || profile?.username?.[0] || user.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{profile?.display_name || profile?.username}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => navigate('/auth')}
                    variant="outline" 
                    size="sm"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    size="sm"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              {user && (
                <Button 
                  onClick={() => navigate('/create-post')}
                  variant="ghost" 
                  size="sm"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col space-y-4 py-4">
              <Link
                to="/"
                className={`transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className={`transition-colors hover:text-primary ${
                  isActive("/blog") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className={`transition-colors hover:text-primary ${
                  isActive("/about") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    size="sm" 
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              )}
              
              <div className="pt-2">
                <form className="relative flex" onSubmit={handleHeaderSearch}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="default" className="ml-2">Search</Button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;