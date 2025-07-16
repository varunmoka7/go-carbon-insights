import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('community_users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, additionalData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/community`,
          data: additionalData
        }
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('community_users').insert({
          id: data.user.id,
          email,
          ...additionalData,
          role: 'member',
          is_gct_team: false,
          reputation: 0
        });
      }
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, signup, logout, fetchProfile };
} 