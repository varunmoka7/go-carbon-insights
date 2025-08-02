import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearDemoMode } from '@/utils/clearDemoMode';
import { 
  sanitizeInput, 
  validateEmail, 
  validatePassword, 
  validateUsername,
  checkRateLimit,
  getGenericAuthError 
} from '@/utils/securityValidation';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorFallback from '@/components/ErrorFallback';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authFailed: boolean;
  authError: Error | null;
  isLoggingOut: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error: any }>;
  signInWithUsername: (username: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithGitHub: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: any }>;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Timeout wrapper for promises
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Demo mode configurable via environment variable
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

  const initializeAuth = async () => {
    console.log('Initializing authentication...');
    setLoading(true);
    setAuthFailed(false);
    setAuthError(null);

    try {
      // In demo mode, simulate a quick loading state then allow access
      if (isDemoMode) {
        console.log('Demo mode enabled, skipping Supabase authentication');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a mock user for demo purposes
        const mockUser = {
          id: 'demo-user',
          email: 'demo@gocarbontracker.net',
          email_confirmed_at: new Date().toISOString(),
        } as User;
        
        setUser(mockUser);
        setLoading(false);
        return;
      }

      // Production mode: normal auth flow with timeout
      console.log('Production mode, initializing Supabase...');
      
      // Set up auth state listener with timeout
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth event:', event, session?.user?.id ? 'User authenticated' : 'No user');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
            console.log('Email verified and user signed in');
            // Clear demo mode when user successfully signs in
            clearDemoMode();
          }
        }
      );

      // Get initial session with 5-second timeout
      const sessionResult = await withTimeout(
        supabase.auth.getSession(),
        5000
      );

      console.log('Session retrieved:', sessionResult.data.session?.user?.id ? 'User found' : 'No user');
      setSession(sessionResult.data.session);
      setUser(sessionResult.data.session?.user ?? null);
      setLoading(false);

      return () => subscription.unsubscribe();
      
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      setAuthError(error as Error);
      setAuthFailed(true);
      setLoading(false);
    }
  };

  const retryAuth = () => {
    console.log('Retrying authentication...');
    initializeAuth();
  };

  useEffect(() => {
    initializeAuth();
  }, [isDemoMode]);

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setLoading(true);
      
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedUsername = username ? sanitizeInput(username) : sanitizedEmail.split('@')[0];
      
      if (!checkRateLimit(`signup:${sanitizedEmail}`, 3, 15 * 60 * 1000)) {
        return { error: { message: 'Too many signup attempts. Please try again later.' } };
      }
      
      if (!validateEmail(sanitizedEmail)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.message } };
      }

      const usernameValidation = validateUsername(sanitizedUsername);
      if (!usernameValidation.isValid) {
        return { error: { message: usernameValidation.message } };
      }

      // Use the current origin for email redirect
      const redirectUrl = `${window.location.origin}/auth?verified=true`;
      
      console.log('Attempting signup with email verification...');
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: sanitizedUsername,
            display_name: sanitizedUsername,
            full_name: sanitizedUsername
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('User already registered')) {
          return { error: { message: 'An account with this email already exists. Please try signing in instead.' } };
        }
        if (error.message.includes('email rate limit')) {
          return { error: { message: 'Too many emails sent. Please wait a few minutes before trying again.' } };
        }
        return { error: { message: error.message || 'Unable to create account. Please try again.' } };
      }

      console.log('Signup response:', { 
        user: data.user ? 'User created' : 'No user', 
        session: data.session ? 'Session active' : 'No session',
        emailConfirmed: data.user?.email_confirmed_at ? 'Email confirmed' : 'Email verification required'
      });

      // Check if email verification is required
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email verification required for:', sanitizedEmail);
        return { 
          error: null, 
          requiresVerification: true,
          message: 'Please check your email and click the verification link to complete registration.'
        };
      }

      // If user is immediately confirmed (no email verification required)
      if (data.user && data.session && data.user.email_confirmed_at) {
        console.log('User confirmed immediately, auto-login successful');
        setUser(data.user);
        setSession(data.session);
        return { error: null, requiresVerification: false };
      }

      // Handle case where user exists but needs verification
      if (data.user && !data.session) {
        return { 
          error: null, 
          requiresVerification: true,
          message: 'Please check your email and click the verification link to complete registration.'
        };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: { message: 'An unexpected error occurred during signup. Please try again.' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      
      const cleanInput = sanitizeInput(emailOrUsername).toLowerCase();
      
      if (!checkRateLimit(`signin:${cleanInput}`, 5, 15 * 60 * 1000)) {
        return { error: { message: 'Too many login attempts. Please try again later.' } };
      }
      
      const isEmail = validateEmail(cleanInput);
      
      if (isEmail) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanInput,
          password
        });
        
        if (error) {
          console.error('Email login error:', error);
          return { error: { message: getGenericAuthError() } };
        }
        
        return { error: null };
      } else {
        return await signInWithUsername(cleanInput, password);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error: { message: getGenericAuthError() } };
    } finally {
      setLoading(false);
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const cleanUsername = sanitizeInput(username).toLowerCase();
      
      const usernameValidation = validateUsername(cleanUsername);
      if (!usernameValidation.isValid) {
        return { error: { message: getGenericAuthError() } };
      }
      
      const { data: profile, error: lookupError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (lookupError) {
        console.error('Username lookup error:', lookupError);
        return { error: { message: getGenericAuthError() } };
      }

      if (!profile) {
        return { error: { message: getGenericAuthError() } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password
      });

      if (error) {
        console.error('Username login error:', error);
        return { error: { message: getGenericAuthError() } };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected username login error:', error);
      return { error: { message: getGenericAuthError() } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      if (!checkRateLimit('oauth:google', 5, 15 * 60 * 1000)) {
        return { error: { message: 'Too many OAuth attempts. Please try again later.' } };
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/community`
        }
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { error: { message: 'Unable to sign in with Google. Please try again.' } };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected Google OAuth error:', error);
      return { error: { message: 'An unexpected error occurred during Google sign in' } };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      
      if (!checkRateLimit('oauth:github', 5, 15 * 60 * 1000)) {
        return { error: { message: 'Too many OAuth attempts. Please try again later.' } };
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/community`
        }
      });
      
      if (error) {
        console.error('GitHub OAuth error:', error);
        return { error: { message: 'Unable to sign in with GitHub. Please try again.' } };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected GitHub OAuth error:', error);
      return { error: { message: 'An unexpected error occurred during GitHub sign in' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoggingOut(true);
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return { error };
      }

      setUser(null);
      setSession(null);
      
      // Add a small delay to allow navigation to complete before clearing logout state
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 100);
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected logout error:', error);
      setIsLoggingOut(false);
      return { error: { message: 'An unexpected error occurred during logout' } };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const sanitizedEmail = sanitizeInput(email);
      
      if (!checkRateLimit(`reset:${sanitizedEmail}`, 2, 15 * 60 * 1000)) {
        return { error: { message: 'Too many password reset attempts. Please try again later.' } };
      }
      
      if (!validateEmail(sanitizedEmail)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error: null };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: null };
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setLoading(true);
      
      const sanitizedEmail = sanitizeInput(email);
      
      if (!checkRateLimit(`reset:${sanitizedEmail}`, 2, 15 * 60 * 1000)) {
        return { error: { message: 'Too many password reset attempts. Please try again later.' } };
      }
      
      if (!validateEmail(sanitizedEmail)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Password reset email error:', error);
        return { error: { message: 'Unable to send password reset email. Please try again.' } };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset email error:', error);
      return { error: { message: 'An unexpected error occurred while sending the reset email' } };
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.message || 'Password does not meet requirements' } };
      }

      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) {
        console.error('Password update error:', error);
        return { error: { message: 'Unable to update password. Please try again.' } };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password update error:', error);
      return { error: { message: 'An unexpected error occurred while updating the password' } };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    authFailed,
    authError,
    isLoggingOut,
    signUp,
    signIn,
    signInWithUsername,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    sendPasswordResetEmail,
    updateUserPassword,
    retryAuth
  };

  // Render loading screen while initializing
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <LoadingScreen message="Initializing authentication..." />
      </AuthContext.Provider>
    );
  }

  // Render error fallback if authentication failed
  if (authFailed) {
    return (
      <AuthContext.Provider value={value}>
        <ErrorFallback 
          message="Authentication failed. Please check your network connection and environment configuration."
          error={authError}
          onRetry={retryAuth}
          showHome={false}
        />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
