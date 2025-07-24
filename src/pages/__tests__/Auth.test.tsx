import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Auth from '../Auth';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the useAuth hook
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockResetPassword = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignInWithGitHub = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    resetPassword: mockResetPassword,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithGitHub: mockSignInWithGitHub,
    user: null,
    loading: false,
  }),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Logo component
vi.mock('@/components/ui/Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock security validation functions
vi.mock('@/utils/securityValidation', () => ({
  sanitizeInput: vi.fn((input: string) => input),
  validateEmail: vi.fn((email: string) => email.includes('@')),
  validatePassword: vi.fn(() => ({ isValid: true })),
  validateUsername: vi.fn(() => ({ isValid: true })),
}));

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Auth Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sign in form by default', () => {
    renderWithProviders(<Auth />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email or Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('should switch to sign up mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    const signUpLink = screen.getByRole('button', { name: 'Sign up' });
    await user.click(signUpLink);
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('should switch to forgot password mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    const forgotPasswordLink = screen.getByText('Forgot your password?');
    await user.click(forgotPasswordLink);
    
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByText('Send Reset Email')).toBeInTheDocument();
    expect(screen.getByText('Remember your password?')).toBeInTheDocument();
  });

  it('should handle sign in form submission', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: null });
    
    renderWithProviders(<Auth />);
    
    const emailInput = screen.getByLabelText('Email or Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should handle sign up form submission', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValueOnce({ error: null });
    
    renderWithProviders(<Auth />);
    
    // Switch to sign up mode
    const signUpLink = screen.getByRole('button', { name: 'Sign up' });
    await user.click(signUpLink);
    
    const emailInput = screen.getByLabelText('Email address');
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
    });
  });

  it('should handle forgot password form submission', async () => {
    const user = userEvent.setup();
    mockResetPassword.mockResolvedValueOnce({ error: null });
    
    renderWithProviders(<Auth />);
    
    // Switch to forgot password mode
    const forgotPasswordLink = screen.getByText('Forgot your password?');
    await user.click(forgotPasswordLink);
    
    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: 'Send Reset Email' });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should show error for invalid form submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);
    
        expect(await screen.findByText('Please fill in all required fields')).toBeInTheDocument();
  });

  it('should show error for password mismatch in sign up', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    // Switch to sign up mode
    const signUpLink = screen.getByRole('button', { name: 'Sign up' });
    await user.click(signUpLink);
    
    const emailInput = screen.getByLabelText('Email address');
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /show password|hide password/i }); // Eye icon button
    
    expect(passwordInput.type).toBe('password');
    
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should handle authentication errors', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });
    
    renderWithProviders(<Auth />);
    
    const emailInput = screen.getByLabelText('Email or Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    // First trigger an error
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);
    
        expect(await screen.findByText('Please fill in all required fields')).toBeInTheDocument();
    
    // Then start typing
    const emailInput = screen.getByLabelText('Email or Username');
    await user.type(emailInput, 'test');
    
    await waitFor(() => {
      expect(screen.queryByRole('alert', { name: 'Please fill in all required fields' })).not.toBeInTheDocument();
    });
  });

  it('should render OAuth buttons in sign in and sign up modes', () => {
    renderWithProviders(<Auth />);
    
    // Should show OAuth buttons in sign in mode
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
  });

  it('should render OAuth buttons in sign up mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    // Switch to sign up mode
    const signUpLink = screen.getByRole('button', { name: 'Sign up' });
    await user.click(signUpLink);
    
    // Should show OAuth buttons in sign up mode
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Or continue with email')).toBeInTheDocument();
  });

  it('should not render OAuth buttons in forgot password mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);
    
    // Switch to forgot password mode
    const forgotPasswordLink = screen.getByText('Forgot your password?');
    await user.click(forgotPasswordLink);
    
    // Should not show OAuth buttons in forgot password mode
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with GitHub')).not.toBeInTheDocument();
    expect(screen.queryByText('Or continue with email')).not.toBeInTheDocument();
  });

  it('should handle Google OAuth button click', async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockResolvedValueOnce({ error: null });
    
    renderWithProviders(<Auth />);
    
    const googleButton = screen.getByText('Continue with Google');
    await user.click(googleButton);
    
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle GitHub OAuth button click', async () => {
    const user = userEvent.setup();
    mockSignInWithGitHub.mockResolvedValueOnce({ error: null });
    
    renderWithProviders(<Auth />);
    
    const githubButton = screen.getByText('Continue with GitHub');
    await user.click(githubButton);
    
    await waitFor(() => {
      expect(mockSignInWithGitHub).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle OAuth errors', async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockResolvedValueOnce({ 
      error: { message: 'OAuth provider not configured' } 
    });
    
    renderWithProviders(<Auth />);
    
    const googleButton = screen.getByText('Continue with Google');
    await user.click(googleButton);
    
    await waitFor(() => {
      expect(screen.getByText('OAuth provider not configured')).toBeInTheDocument();
    });
  });

  it('should handle OAuth rate limiting', async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockResolvedValueOnce({ 
      error: { message: 'Too many OAuth attempts. Please try again later.' } 
    });
    
    renderWithProviders(<Auth />);
    
    const googleButton = screen.getByText('Continue with Google');
    await user.click(googleButton);
    
    await waitFor(() => {
      expect(await screen.findByText('Too many OAuth attempts. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should disable OAuth buttons when loading', async () => {
    const user = userEvent.setup();
    // Mock to simulate loading state
    mockSignInWithGoogle.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ error: null }), 100);
    }));
    
    renderWithProviders(<Auth />);
    
    const googleButton = screen.getByText('Continue with Google');
    const githubButton = screen.getByText('Continue with GitHub');
    
    await user.click(googleButton);
    
    // Buttons should be disabled during loading
    expect(googleButton).toBeDisabled();
    expect(githubButton).toBeDisabled();
  });
});