
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error: any }>;
  signInWithUsername: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Supabase client for better session handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setLoading(true);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      // Validate password strength
      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters long' } };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || email.split('@')[0],
            display_name: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      
      // Sanitize input
      const cleanInput = emailOrUsername.trim().toLowerCase();
      
      // Check if input looks like an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(cleanInput);
      
      if (isEmail) {
        // Direct email login
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanInput,
          password
        });
        
        if (error) {
          console.error('Email login error:', error);
          return { error };
        }
        
        return { error: null };
      } else {
        // Username login - lookup email first
        return await signInWithUsername(cleanInput, password);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error: { message: 'An unexpected error occurred during login' } };
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      // Sanitize username input
      const cleanUsername = username.trim().toLowerCase();
      
      // Lookup email by username
      const { data: profile, error: lookupError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (lookupError) {
        console.error('Username lookup error:', lookupError);
        return { error: { message: 'Failed to find user with that username' } };
      }

      if (!profile) {
        return { error: { message: 'No user found with that username' } };
      }

      // Sign in with the found email
      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password
      });

      if (error) {
        console.error('Username login error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected username login error:', error);
      return { error: { message: 'An unexpected error occurred during username login' } };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return { error };
      }

      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      console.error('Unexpected logout error:', error);
      return { error: { message: 'An unexpected error occurred during logout' } };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: { message: 'An unexpected error occurred during password reset' } };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithUsername,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
