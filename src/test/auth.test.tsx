import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Auth from '../pages/Auth';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

// Mock the AuthContext and its functions
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockResetPassword = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSignInWithGitHub = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    resetPassword: mockResetPassword,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithGitHub: mockSignInWithGitHub,
    user: null, // Simulate no user logged in initially
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the Logo component
jest.mock('@/components/ui/Logo', () => {
  return ({ className }: { className?: string }) => <div className={className}>Mock Logo</div>;
});

// Mock the RainAnimation component
jest.mock('@/components/ui/RainAnimation', () => {
  return () => <div data-testid="rain-animation">Mock Rain Animation</div>;
});

// Helper function to render the Auth component within a MemoryRouter
const renderAuthComponent = (initialEntries = ['/auth']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </MemoryRouter>
  );
};

describe('Auth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Renders Sign In form by default
  test('renders Sign In form by default', () => {
    renderAuthComponent();
    expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  // Test Case 2: Switches to Sign Up form
  test('switches to Sign Up form', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create your account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
    });
  });

  // Test Case 3: Switches to Forgot Password form
  test('switches to Forgot Password form', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByRole('button', { name: /Forgot your password?/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Reset your password/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Reset Email/i })).toBeInTheDocument();
      expect(screen.getByText(/Remember your password?/i)).toBeInTheDocument();
    });
  });

  // Test Case 4: Handles Sign In with valid credentials
  test('handles Sign In with valid credentials', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    renderAuthComponent();

    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  // Test Case 5: Displays error for invalid Sign In credentials
  test('displays error for invalid Sign In credentials', async () => {
    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });
    renderAuthComponent();

    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  // Test Case 6: Handles Sign Up with valid credentials
  test('handles Sign Up with valid credentials', async () => {
    mockSignUp.mockResolvedValueOnce({ error: null });
    renderAuthComponent();

    fireEvent.click(screen.getByRole('button', { name: /Sign up/i })); // Switch to sign up form

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create your account/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('newuser@example.com', 'Password123!', 'newuser');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Account Created Successfully",
      }));
      expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument(); // Should switch back to sign in
    });
  });

  // Test Case 7: Displays error for mismatched passwords during Sign Up
  test('displays error for mismatched passwords during Sign Up', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create your account/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'mismatch@example.com' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'mismatch' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'PasswordMismatch!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  // Test Case 8: Handles Forgot Password request
  test('handles Forgot Password request', async () => {
    mockResetPassword.mockResolvedValueOnce({ error: null });
    renderAuthComponent();

    fireEvent.click(screen.getByRole('button', { name: /Forgot your password?/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Reset your password/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'reset@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('reset@example.com');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Password Reset Email Sent",
      }));
      expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument(); // Should switch back to sign in
    });
  });

  // Test Case 9: Displays error for invalid email during Forgot Password
  test('displays error for invalid email during Forgot Password', async () => {
    renderAuthComponent();
    fireEvent.click(screen.getByRole('button', { name: /Forgot your password?/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Reset your password/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/i }));

    await waitFor(() => {
          expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });

  // Test Case 10: Toggles password visibility
  test('toggles password visibility', async () => {
    renderAuthComponent();
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole('button', { name: /Show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test Case 11: Handles Google Sign In
  test('handles Google Sign In', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce({ error: null });
    renderAuthComponent();

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  // Test Case 12: Handles GitHub Sign In
  test('handles GitHub Sign In', async () => {
    mockSignInWithGitHub.mockResolvedValueOnce({ error: null });
    renderAuthComponent();

    fireEvent.click(screen.getByRole('button', { name: /Continue with GitHub/i }));

    await waitFor(() => {
      expect(mockSignInWithGitHub).toHaveBeenCalledTimes(1);
    });
  });

  // Test Case 14: Displays redirect message if present in location state
  test('displays redirect message if present in location state', () => {
    const message = 'Please sign in to access this page.';
    render(
      <MemoryRouter initialEntries={[{ pathname: '/auth', state: { message } }]}>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </AuthProvider>
        <Toaster />
      </MemoryRouter>
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // Test Case 15: Displays email verification success toast
  test('displays email verification success toast', async () => {
    renderAuthComponent(['/auth?token_hash=somehash&type=email']);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Email Verified Successfully",
      }));
    });
  });

  // Test Case 16: Displays email verification error toast
  test('displays email verification error toast', async () => {
    renderAuthComponent(['/auth?error=true&error_description=Invalid+token']);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Verification Error",
        description: "Invalid token",
        variant: "destructive",
      }));
    });
  });

  // Test Case 17: Displays email not confirmed toast
  test('displays email not confirmed toast', async () => {
    renderAuthComponent(['/auth?error_code=email_not_confirmed']);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Email Not Verified",
        description: "Please check your email and click the verification link before signing in.",
        variant: "destructive",
      }));
    });
  });

});