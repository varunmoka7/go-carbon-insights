import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase client
const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    signInWithOAuth: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(),
      })),
    })),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock security validation functions
vi.mock('@/utils/securityValidation', () => ({
  sanitizeInput: vi.fn((input: string) => input),
  validateEmail: vi.fn((email: string) => email.includes('@')),
  validatePassword: vi.fn(() => ({ isValid: true })),
  validateUsername: vi.fn(() => ({ isValid: true })),
  checkRateLimit: vi.fn(() => true),
  getGenericAuthError: vi.fn(() => 'Invalid credentials'),
}));

const TestComponent = () => {
  const { signIn, signUp, resetPassword, signInWithGoogle, signInWithGitHub, user, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.email || 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => signIn('test@example.com', 'password123')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password123', 'testuser')}>
        Sign Up
      </button>
      <button onClick={() => resetPassword('test@example.com')}>
        Reset Password
      </button>
      <button onClick={() => signInWithGoogle()}>
        Sign In with Google
      </button>
      <button onClick={() => signInWithGitHub()}>
        Sign In with GitHub
      </button>
    </div>
  );
};

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('user')).toBeInTheDocument();
  });

  it('should handle successful email sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { email: 'test@example.com' }, session: {} },
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle sign in error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    renderWithProviders(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });

  it('should handle username-based sign in', async () => {
    // Mock username lookup
    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({
            data: { email: 'test@example.com' },
            error: null,
          })),
        })),
      })),
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { email: 'test@example.com' }, session: {} },
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
    });
  });

  it('should handle successful sign up', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { 
        user: { email: 'test@example.com', email_confirmed_at: new Date().toISOString() },
        session: {} 
      },
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/auth'),
          data: {
            username: 'testuser',
            display_name: 'testuser',
          },
        },
      });
    });
  });

  it('should handle password reset', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const resetButton = screen.getByText('Reset Password');
    resetButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: expect.stringContaining('/auth?mode=reset'),
        }
      );
    });
  });

  it('should handle rate limiting', async () => {
    const { checkRateLimit } = await import('@/utils/securityValidation');
    vi.mocked(checkRateLimit).mockReturnValueOnce(false);

    renderWithProviders(<TestComponent />);
    
    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(checkRateLimit).toHaveBeenCalled();
    });
  });

  it('should handle successful Google OAuth sign in', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: 'https://accounts.google.com/oauth/authorize?...' },
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const googleSignInButton = screen.getByText('Sign In with Google');
    googleSignInButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth'),
        },
      });
    });
  });

  it('should handle successful GitHub OAuth sign in', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: 'https://github.com/login/oauth/authorize?...' },
      error: null,
    });

    renderWithProviders(<TestComponent />);
    
    const githubSignInButton = screen.getByText('Sign In with GitHub');
    githubSignInButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: expect.stringContaining('/auth'),
        },
      });
    });
  });

  it('should handle OAuth error', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: null },
      error: { message: 'OAuth provider not configured' },
    });

    renderWithProviders(<TestComponent />);
    
    const googleSignInButton = screen.getByText('Sign In with Google');
    googleSignInButton.click();

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalled();
    });
  });

  it('should handle OAuth rate limiting', async () => {
    const { checkRateLimit } = await import('@/utils/securityValidation');
    vi.mocked(checkRateLimit).mockReturnValueOnce(false);

    renderWithProviders(<TestComponent />);
    
    const googleSignInButton = screen.getByText('Sign In with Google');
    googleSignInButton.click();

    await waitFor(() => {
      expect(checkRateLimit).toHaveBeenCalledWith('oauth:google', 5, 15 * 60 * 1000);
    });
  });
});