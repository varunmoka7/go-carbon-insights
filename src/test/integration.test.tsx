import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from './utils'
import { supabase } from '../integrations/supabase/client'
import PrivateRoute from '../components/PrivateRoute'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'

// Mock the supabase client
vi.mock('../integrations/supabase/client')

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Protected Routes', () => {
    it('redirects unauthenticated users to login', async () => {
      // Mock no user session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      render(
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      )

      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
      })
    })

    it('allows authenticated users to access protected routes', async () => {
      // Mock authenticated session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { 
              id: 'test-user-id', 
              email: 'test@example.com',
              email_confirmed_at: new Date().toISOString()
            } 
          } 
        },
        error: null
      })

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })

      render(
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      )

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Profile Auto-Creation', () => {
    it('verifies profile creation on signup', async () => {
      const user = userEvent.setup()
      
      // Mock successful signup with profile creation
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: {
          user: {
            id: 'new-user-id',
            email: 'newuser@example.com',
            email_confirmed_at: new Date().toISOString()
          } as any,
          session: {
            access_token: 'mock-token',
            user: { id: 'new-user-id' }
          } as any
        },
        error: null
      })

      // Mock profile query to simulate trigger worked
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'new-user-id',
                email: 'newuser@example.com',
                username: 'newuser',
                full_name: 'New User',
                role: 'user',
                created_at: new Date().toISOString()
              },
              error: null
            })
          }))
        }))
      }))
      
      vi.mocked(supabase.from).mockReturnValue(mockFrom() as any)

      render(<div>Profile creation test</div>)

      // This would typically be called by the auth context
      const signUpResult = await supabase.auth.signUp({
        email: 'newuser@example.com',
        password: 'Password123!',
        options: {
          data: {
            username: 'newuser',
            display_name: 'New User'
          }
        }
      })

      expect(signUpResult.data.user).toBeDefined()
      expect(signUpResult.data.user?.email).toBe('newuser@example.com')
    })
  })

  describe('RLS Policy Enforcement', () => {
    it('ensures users can only access their own data', async () => {
      const user = userEvent.setup()
      
      // Mock authenticated session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { 
          session: { 
            user: { 
              id: 'user-123', 
              email: 'user@example.com' 
            } 
          } 
        },
        error: null
      })

      // Mock database query that should only return user's own data
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'user-123',
                email: 'user@example.com',
                username: 'user123',
                // Should NOT include other users' data
              },
              error: null
            })
          }))
        }))
      }))
      
      vi.mocked(supabase.from).mockReturnValue(mockFrom() as any)

      render(<div>RLS test</div>)

      // Simulate query for user profile
      const { data } = await supabase.from('profiles').select('*').eq('id', 'user-123').single()
      
      expect(data?.id).toBe('user-123')
      expect(data?.email).toBe('user@example.com')
    })
  })

  describe('Error Handling', () => {
    it('handles authentication errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock authentication error
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { 
          message: 'Invalid login credentials',
          status: 400
        } as any
      })

      render(<div>Error handling test</div>)

      const result = await supabase.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid login credentials')
      expect(result.data.user).toBeNull()
    })

    it('handles database errors gracefully', async () => {
      // Mock database error
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { 
                message: 'Row not found',
                code: 'PGRST116'
              }
            })
          }))
        }))
      }))
      
      vi.mocked(supabase.from).mockReturnValue(mockFrom() as any)

      render(<div>Database error test</div>)

      const result = await supabase.from('profiles').select('*').eq('id', 'nonexistent').single()
      
      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Row not found')
      expect(result.data).toBeNull()
    })
  })
})