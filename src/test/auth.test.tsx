import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from './utils'
import { supabase } from '../integrations/supabase/client'
import AuthPage from '../pages/Auth'
import App from '../App'

// Mock the supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          maybeSingle: vi.fn()
        })),
        limit: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn()
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn()
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}))

describe('Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mocks for successful operations
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null
    })
    
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  })

  describe('User Registration', () => {
    it('creates user profile on successful signup', async () => {
      const user = userEvent.setup()
      
      // Mock successful signup
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString()
          } as any,
          session: {
            access_token: 'mock-token',
            user: { id: 'test-user-id' }
          } as any
        },
        error: null
      })

      render(<AuthPage />)

      // Switch to signup mode
      const signUpButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(signUpButton)

      // Fill form
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      // Verify signup was called
      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!',
          options: {
            emailRedirectTo: expect.stringContaining('/auth'),
            data: {
              username: 'testuser',
              display_name: 'testuser'
            }
          }
        })
      })
    })

    it('shows validation errors for invalid input', async () => {
      const user = userEvent.setup()
      
      render(<AuthPage />)

      // Switch to signup mode
      const signUpButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(signUpButton)
      
      // Try to submit with invalid email
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/^password$/i), 'weak')
      await user.type(screen.getByLabelText(/confirm password/i), 'weak')
      
      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
      })
    })
  })

  describe('User Login', () => {
    it('logs in with email and password', async () => {
      const user = userEvent.setup()
      
      // Mock successful login
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          } as any,
          session: {
            access_token: 'mock-token',
            user: { id: 'test-user-id' }
          } as any
        },
        error: null
      })

      render(<AuthPage />)

      await user.type(screen.getByLabelText(/email or username/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'Password123!')
      
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(signInButton)

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!'
        })
      })
    })

    it('logs in with username', async () => {
      const user = userEvent.setup()
      
      // Mock username lookup
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { email: 'test@example.com' },
              error: null
            })
          }))
        }))
      }))
      
      vi.mocked(supabase.from).mockReturnValue(mockFrom() as any)
      
      // Mock successful login
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          } as any,
          session: {
            access_token: 'mock-token',
            user: { id: 'test-user-id' }
          } as any
        },
        error: null
      })

      render(<AuthPage />)

      await user.type(screen.getByLabelText(/email or username/i), 'testuser')
      await user.type(screen.getByLabelText(/password/i), 'Password123!')
      
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(signInButton)

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('profiles')
      })
    })

    it('shows error for invalid credentials', async () => {
      const user = userEvent.setup()
      
      // Mock failed login
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' } as any
      })

      render(<AuthPage />)

      await user.type(screen.getByLabelText(/email or username/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(signInButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('OAuth Authentication', () => {
    it('initiates Google OAuth flow', async () => {
      const user = userEvent.setup()
      
      // Mock successful OAuth initiation
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: 'https://accounts.google.com/oauth' },
        error: null
      })

      render(<AuthPage />)

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)

      await waitFor(() => {
        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: {
            redirectTo: expect.stringContaining('/auth')
          }
        })
      })
    })

    it('initiates GitHub OAuth flow', async () => {
      const user = userEvent.setup()
      
      // Mock successful OAuth initiation
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'github', url: 'https://github.com/login/oauth' },
        error: null
      })

      render(<AuthPage />)

      const githubButton = screen.getByRole('button', { name: /continue with github/i })
      await user.click(githubButton)

      await waitFor(() => {
        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'github',
          options: {
            redirectTo: expect.stringContaining('/auth')
          }
        })
      })
    })
  })

  describe('Password Reset', () => {
    it('sends password reset email', async () => {
      const user = userEvent.setup()
      
      // Mock successful password reset
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: {},
        error: null
      })

      render(<AuthPage />)

      // Click forgot password
      const forgotPasswordButton = screen.getByRole('button', { name: /forgot your password/i })
      await user.click(forgotPasswordButton)

      // Fill email and submit
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      
      const sendResetButton = screen.getByRole('button', { name: /send reset email/i })
      await user.click(sendResetButton)

      await waitFor(() => {
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com',
          {
            redirectTo: expect.stringContaining('/auth?mode=reset')
          }
        )
      })
    })
  })

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      const user = userEvent.setup()
      
      render(<AuthPage />)

      // Try to submit empty form
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(signInButton)

      await waitFor(() => {
        expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument()
      })
    })

    it('validates password strength on signup', async () => {
      const user = userEvent.setup()
      
      render(<AuthPage />)

      // Switch to signup mode
      const signUpButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(signUpButton)

      // Fill form with weak password
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/^password$/i), 'weak')
      await user.type(screen.getByLabelText(/confirm password/i), 'weak')

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()
      
      render(<AuthPage />)

      // Switch to signup mode
      const signUpButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(signUpButton)

      // Fill form with mismatched passwords
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPassword123!')

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })
  })
})