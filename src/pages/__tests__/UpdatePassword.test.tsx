import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UpdatePassword from '../UpdatePassword';
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
  validatePassword: vi.fn((password: string) => {
    const isValid = password.length >= 8 && 
                   /[A-Z]/.test(password) && 
                   /[a-z]/.test(password) && 
                   /\d/.test(password) && 
                   /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      isValid,
      message: isValid ? null : 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
    };
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

describe('UpdatePassword', () => {
  const mockUpdateUserPassword = vi.fn();
  const mockToast = vi.fn();
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock implementations
    (useAuth as any).mockReturnValue({
      updateUserPassword: mockUpdateUserPassword,
      loading: false,
      user: mockUser,
    });

    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders the update password form correctly', () => {
    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /update your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  it('redirects to auth if user is not authenticated', () => {
    (useAuth as any).mockReturnValue({
      updateUserPassword: mockUpdateUserPassword,
      loading: false,
      user: null, // No user authenticated
    });

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('handles successful password update with redirect', async () => {
    const user = userEvent.setup();
    mockUpdateUserPassword.mockResolvedValueOnce({ error: null });

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    const validPassword = 'NewPassword123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);

    // Wait for password strength to be calculated
    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUserPassword).toHaveBeenCalledWith(validPassword);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Password Updated Successfully',
      description: 'Your password has been updated. Please sign in with your new password.',
    });

    // Should redirect to auth page after 2 seconds
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    }, { timeout: 3000 });
  });

  it('shows error for empty password fields', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /update password/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });

    expect(mockUpdateUserPassword).not.toHaveBeenCalled();
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    const shortPassword = '123';
    await user.type(passwordInput, shortPassword);
    await user.type(confirmPasswordInput, shortPassword);

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    expect(mockUpdateUserPassword).not.toHaveBeenCalled();
  });

  it('shows error for password mismatch', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'DifferentPassword123!');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    expect(mockUpdateUserPassword).not.toHaveBeenCalled();
  });

  it('shows password strength indicators', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);

    // Test weak password
    await user.type(passwordInput, 'weak');
    await waitFor(() => {
      expect(screen.getByText(/weak/i)).toBeInTheDocument();
    });

    // Clear and test strong password
    await user.clear(passwordInput);
    await user.type(passwordInput, 'StrongPassword123!');
    
    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    // Should show all strength requirements as met
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();
  });

  it('disables submit button for weak passwords', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    // Enter weak password
    await user.type(passwordInput, 'weak');

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('enables submit button for strong passwords', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    // Enter strong password
    await user.type(passwordInput, 'StrongPassword123!');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows loading state during password update', async () => {
    // Mock loading state
    (useAuth as any).mockReturnValue({
      updateUserPassword: mockUpdateUserPassword,
      loading: true,
      user: mockUser,
    });

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /updating.../i });

    expect(submitButton).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(screen.getByText(/updating.../i)).toBeInTheDocument();
  });

  it('handles API error response', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Unable to update password. Please try again.';
    mockUpdateUserPassword.mockResolvedValueOnce({ 
      error: { message: errorMessage } 
    });

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    const validPassword = 'NewPassword123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);

    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

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

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup();
    mockUpdateUserPassword.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    const validPassword = 'NewPassword123!';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);

    await waitFor(() => {
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

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

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const toggleButton = screen.getAllByRole('button')[1]; // First toggle button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navigates back to auth when return to sign in is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const backButton = screen.getByRole('button', { name: /return to sign in/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('shows password mismatch indicator in real-time', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'DifferentPassword');

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UpdatePassword />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /update password/i });

    // Submit without password to show error
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(passwordInput, 'P');

    await waitFor(() => {
      expect(screen.queryByText(/please fill in all required fields/i)).not.toBeInTheDocument();
    });
  });
});