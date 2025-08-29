import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [targetUserId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || user.id !== targetUserId) return { error: 'Unauthorized' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};