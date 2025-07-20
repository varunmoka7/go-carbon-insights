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
  }),

  http.get('/api/forum/users/profile', () => {
    return HttpResponse.json({
      user: {
        id: 'user-123',
        username: 'testuser',
        displayName: 'Test User',
        bio: 'This is a test bio.',
        avatarUrl: null,
        role: 'user',
        reputation: 123,
        isGctTeam: false,
        memberSince: '2024-01-01T00:00:00.000Z'
      },
      badges: [{ id: '1', name: 'Newcomer', category: 'reputation', awardedAt: '2024-01-01T00:00:00.000Z', description: 'Awarded for being new', icon: 'star' }],
      badgeStats: { totalBadges: 1, badgesByCategory: { reputation: 1 }, recentBadges: [] },
      reputationBreakdown: { totalReputation: 123, breakdown: { topics: 50, replies: 50, upvotes: 23 } }
    })
  }),

  http.get('/api/forum/users/profile/other-user-456', () => {
    return HttpResponse.json({
      user: {
        id: 'other-user-456',
        username: 'otheruser',
        displayName: 'Other User',
        bio: null,
        avatarUrl: null,
        role: 'user',
        reputation: 456,
        isGctTeam: true,
        memberSince: '2024-01-01T00:00:00.000Z'
      },
      badges: [],
      badgeStats: { totalBadges: 0, badgesByCategory: {}, recentBadges: [] },
      reputationBreakdown: { totalReputation: 456, breakdown: { topics: 200, replies: 200, upvotes: 56 } }
    })
  }),

  http.get('/api/forum/users/profile/non-existent-user', () => {
    return new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/topics', () => {
    return HttpResponse.json({ topics: [] })
  }),

  http.get('/api/topics/non-existent-id', () => {
    return new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  http.get('/api/health/ready', () => {
    return HttpResponse.json({ status: 'ready' })
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json({ categories: [] })
  }),

  http.get('/api/categories/:id', () => {
    return HttpResponse.json({ id: '1', name: 'Test Category' })
  }),
]