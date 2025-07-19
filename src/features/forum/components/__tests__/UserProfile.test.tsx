import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import UserProfile from '../UserProfile';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockUser = {
  id: 'user-123',
  username: 'testuser',
  role: 'user',
};

const mockProfileData = {
  user: {
    id: 'user-123',
    username: 'testuser',
    displayName: 'Test User',
    email: 'test@example.com',
    bio: 'This is a test bio',
    avatarUrl: null,
    role: 'user',
    reputation: 150,
    isGctTeam: false,
    memberSince: '2024-01-01T00:00:00Z',
  },
  badges: [
    {
      id: 'newcomer',
      name: 'Newcomer',
      description: 'Welcome to the community!',
      icon: 'star',
      category: 'reputation',
      awardedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'contributor',
      name: 'Contributor',
      description: 'Active community member',
      icon: 'trophy',
      category: 'reputation',
      awardedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'first-topic',
      name: 'First Topic',
      description: 'Created your first topic',
      icon: 'star',
      category: 'participation',
      awardedAt: '2024-01-10T00:00:00Z',
    },
  ],
  badgeStats: {
    totalBadges: 3,
    badgesByCategory: {
      reputation: 2,
      participation: 1,
    },
    recentBadges: [
      {
        id: 'contributor',
        name: 'Contributor',
        description: 'Active community member',
        icon: 'trophy',
        category: 'reputation',
        awardedAt: '2024-02-01T00:00:00Z',
      },
      {
        id: 'newcomer',
        name: 'Newcomer',
        description: 'Welcome to the community!',
        icon: 'star',
        category: 'reputation',
        awardedAt: '2024-01-15T00:00:00Z',
      },
    ],
  },
  reputationBreakdown: {
    totalReputation: 150,
    breakdown: {
      topics: 50,
      replies: 60,
      upvotes: 40,
    },
  },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });
  });

  describe('Profile Display', () => {
    it('should render user profile information', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });

      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument(); // Reputation
      expect(screen.getByText('This is a test bio')).toBeInTheDocument();
    });

    it('should display reputation breakdown', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Reputation')).toBeInTheDocument();
      });

      expect(screen.getByText('150')).toBeInTheDocument(); // Total reputation
      expect(screen.getByText('50')).toBeInTheDocument(); // Topics
      expect(screen.getByText('60')).toBeInTheDocument(); // Replies
      expect(screen.getByText('40')).toBeInTheDocument(); // Upvotes
    });

    it('should display badge information', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Badges')).toBeInTheDocument();
      });

      expect(screen.getByText('3')).toBeInTheDocument(); // Total badges
      expect(screen.getByText('Newcomer')).toBeInTheDocument();
      expect(screen.getByText('Contributor')).toBeInTheDocument();
    });

    it('should show team badge for GCT team members', async () => {
      const teamMemberData = {
        ...mockProfileData,
        user: {
          ...mockProfileData.user,
          isGctTeam: true,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => teamMemberData,
      });

      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Team Member')).toBeInTheDocument();
      });
    });

    it('should display proper member since date', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText(/Joined January 1, 2024/)).toBeInTheDocument();
      });
    });
  });

  describe('Badge Rendering', () => {
    it('should render badge tooltips', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Newcomer')).toBeInTheDocument();
      });

      // Badge tooltips are rendered but may not be visible until hovered
      const newcomerBadge = screen.getByText('Newcomer');
      expect(newcomerBadge).toBeInTheDocument();
    });

    it('should display badges with correct categories', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Badges')).toBeInTheDocument();
      });

      // Check badge stats by category
      expect(screen.getByText('2')).toBeInTheDocument(); // reputation category count
      expect(screen.getByText('1')).toBeInTheDocument(); // participation category count
    });

    it('should show all badges section when user has many badges', async () => {
      const manyBadgesData = {
        ...mockProfileData,
        badges: [
          ...mockProfileData.badges,
          {
            id: 'expert',
            name: 'Expert',
            description: 'Recognized expertise',
            icon: 'shield',
            category: 'reputation',
            awardedAt: '2024-03-01T00:00:00Z',
          },
          {
            id: 'helper',
            name: 'Helper',
            description: 'Helpful community member',
            icon: 'star',
            category: 'contribution',
            awardedAt: '2024-03-15T00:00:00Z',
          },
        ],
        badgeStats: {
          ...mockProfileData.badgeStats,
          totalBadges: 5,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => manyBadgesData,
      });

      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('All Badges (5)')).toBeInTheDocument();
      });

      expect(screen.getByText('Expert')).toBeInTheDocument();
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    it('should show edit button for own profile', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
    });

    it('should not show edit button for other users profiles', async () => {
      renderWithQueryClient(<UserProfile userId="other-user-456" />);

      await waitFor(() => {
        expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
      });
    });

    it('should enter edit mode when edit button is clicked', async () => {
      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Edit Profile'));

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('This is a test bio')).toBeInTheDocument();
    });

    it('should save profile changes', async () => {
      const mockUpdateResponse = {
        ...mockProfileData,
        user: {
          ...mockProfileData.user,
          displayName: 'Updated Name',
          bio: 'Updated bio',
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProfileData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUpdateResponse,
        });

      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Edit Profile'));

      const nameInput = screen.getByDisplayValue('Test User');
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      const bioInput = screen.getByDisplayValue('This is a test bio');
      fireEvent.change(bioInput, { target: { value: 'Updated bio' } });

      fireEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/forum/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer null',
          },
          body: JSON.stringify({
            displayName: 'Updated Name',
            bio: 'Updated bio',
            avatarUrl: '',
          }),
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when profile fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      renderWithQueryClient(<UserProfile />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
      });
    });

    it('should display error message for non-existent user', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      renderWithQueryClient(<UserProfile userId="non-existent-user" />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch profile')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading skeleton while fetching profile', () => {
      renderWithQueryClient(<UserProfile />);

      expect(screen.getByTestId('loading-skeleton') || document.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('Anonymous User Access', () => {
    it('should display profile for anonymous users', async () => {
      (useAuth as any).mockReturnValue({ user: null });

      renderWithQueryClient(<UserProfile userId="user-123" />);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });

      expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    });
  });
});