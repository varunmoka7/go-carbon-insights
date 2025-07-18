import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ForgotPassword from '../ForgotPassword';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Mock Logo component
vi.mock('@/components/ui/Logo', () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="logo">Logo</div>
  ),
}));

// Mock security validation utilities
vi.mock('@/utils/securityValidation', () => ({
  sanitizeInput: vi.fn((input: string) => input),
  validateEmail: vi.fn((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ForgotPassword', () => {
  const mockSendPasswordResetEmail = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock implementations
    (useAuth as any).mockReturnValue({
      sendPasswordResetEmail: mockSendPasswordResetEmail,
      loading: false,
    });

    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders the forgot password form correctly', () => {
    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to sign in/i })).toBeInTheDocument();
  });

  it('handles successful password reset email submission', async () => {
    const user = userEvent.setup();
    mockSendPasswordResetEmail.mockResolvedValueOnce({ error: null });

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Password Reset Email Sent',
        description: 'Check your email for instructions to reset your password.',
      });
    });

    // Should show success state
    expect(screen.getByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    expect(screen.getByText(/email sent!/i)).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('shows error for empty email field', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    });

    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('handles API error response', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Unable to send password reset email. Please try again.';
    mockSendPasswordResetEmail.mockResolvedValueOnce({ 
      error: { message: errorMessage } 
    });

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock loading state
    (useAuth as any).mockReturnValue({
      sendPasswordResetEmail: mockSendPasswordResetEmail,
      loading: true,
    });

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sending.../i });

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(screen.getByText(/sending.../i)).toBeInTheDocument();
  });

  it('navigates back to sign in when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const backButton = screen.getByRole('button', { name: /back to sign in/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('allows user to try again from success state', async () => {
    const user = userEvent.setup();
    mockSendPasswordResetEmail.mockResolvedValueOnce({ error: null });

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Submit form to get to success state
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email sent!/i)).toBeInTheDocument();
    });

    // Click try again button
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await user.click(tryAgainButton);

    // Should return to form state
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Submit without email to show error
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(emailInput, 't');

    await waitFor(() => {
      expect(screen.queryByText(/please enter your email address/i)).not.toBeInTheDocument();
    });
  });

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup();
    mockSendPasswordResetEmail.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <ForgotPassword />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
  });
});