import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('https://hiplsgbyxbalukmejxaq.supabase.co/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          username: 'testuser',
          full_name: 'Test User'
        }
      },
      session: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    })
  }),

  http.post('https://hiplsgbyxbalukmejxaq.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      },
      session: {
        access_token: 'mock-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    })
  }),

  http.post('https://hiplsgbyxbalukmejxaq.supabase.co/auth/v1/recover', () => {
    return HttpResponse.json({
      message: 'Check your email for the password reset link'
    })
  }),

  // Mock database queries
  http.get('https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
        full_name: 'Test User',
        role: 'user',
        email_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }),

  http.post('https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      full_name: 'Test User',
      role: 'user',
      email_verified: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }),

  http.get('https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/companies', () => {
    return HttpResponse.json([
      {
        id: 'company-1',
        name: 'Test Company',
        industry: 'Technology',
        sector: 'Software',
        description: 'A test company',
        size: 'medium',
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  })
]