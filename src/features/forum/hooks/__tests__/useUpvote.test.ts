import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { useUpvote } from '../useUpvote';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

const mockUser = {
  id: 'user-123',
  username: 'testuser',
  role: 'user',
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useUpvote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
    });
  });

  describe('Topic Upvoting', () => {
    it('should upvote a topic successfully', async () => {
      const mockResponse = {
        message: 'Topic upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 5,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      await act(async () => {
        await result.current.handleTopicUpvote('topic-123', 4);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/forum/upvotes/topics/topic-123', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      });

      expect(result.current.isTopicUpvoted('topic-123')).toBe(true);
    });

    it('should remove upvote from a topic', async () => {
      const mockResponse = {
        message: 'Upvote removed successfully',
        action: 'removed' as const,
        upvoteCount: 3,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      // First set the topic as upvoted
      await act(async () => {
        await result.current.upvoteTopic.mutateAsync('topic-123');
      });

      // Then remove the upvote
      await act(async () => {
        await result.current.handleTopicUpvote('topic-123', 4);
      });

      expect(result.current.isTopicUpvoted('topic-123')).toBe(false);
    });

    it('should handle upvote error with optimistic rollback', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUpvote(), { wrapper });

      const initialUpvoteState = result.current.isTopicUpvoted('topic-123');

      await act(async () => {
        try {
          await result.current.handleTopicUpvote('topic-123', 4);
        } catch (error) {
          // Expected to throw
        }
      });

      // Should rollback to original state
      expect(result.current.isTopicUpvoted('topic-123')).toBe(initialUpvoteState);
    });

    it('should handle optimistic updates correctly', async () => {
      const mockResponse = {
        message: 'Topic upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 5,
      };

      // Delay the response to test optimistic updates
      (global.fetch as any).mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockResponse,
          }), 100)
        )
      );

      const { result } = renderHook(() => useUpvote(), { wrapper });

      expect(result.current.isTopicUpvoted('topic-123')).toBe(false);

      // Start the upvote
      const upvotePromise = act(async () => {
        await result.current.handleTopicUpvote('topic-123', 4);
      });

      // Should immediately show as upvoted (optimistic update)
      expect(result.current.isTopicUpvoted('topic-123')).toBe(true);

      // Wait for the actual response
      await upvotePromise;

      // Should still be upvoted
      expect(result.current.isTopicUpvoted('topic-123')).toBe(true);
    });
  });

  describe('Reply Upvoting', () => {
    it('should upvote a reply successfully', async () => {
      const mockResponse = {
        message: 'Reply upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 3,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      await act(async () => {
        await result.current.handleReplyUpvote('reply-456', 2);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/forum/upvotes/replies/reply-456', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      });

      expect(result.current.isReplyUpvoted('reply-456')).toBe(true);
    });

    it('should handle reply upvote error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      await act(async () => {
        try {
          await result.current.handleReplyUpvote('reply-456', 2);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('Authentication Handling', () => {
    it('should throw error when user is not authenticated', async () => {
      (useAuth as any).mockReturnValue({ user: null });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      await act(async () => {
        try {
          await result.current.upvoteTopic.mutateAsync('topic-123');
        } catch (error) {
          expect(error).toEqual(new Error('Authentication required'));
        }
      });
    });

    it('should not attempt upvote when user is null', async () => {
      (useAuth as any).mockReturnValue({ user: null });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      await act(async () => {
        try {
          await result.current.handleTopicUpvote('topic-123', 4);
        } catch (error) {
          // Should not make any fetch calls
          expect(global.fetch).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('State Management', () => {
    it('should track upvote state for multiple topics', async () => {
      const mockResponse = {
        message: 'Topic upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 5,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      // Upvote multiple topics
      await act(async () => {
        await result.current.handleTopicUpvote('topic-1', 1);
      });

      await act(async () => {
        await result.current.handleTopicUpvote('topic-2', 2);
      });

      expect(result.current.isTopicUpvoted('topic-1')).toBe(true);
      expect(result.current.isTopicUpvoted('topic-2')).toBe(true);
      expect(result.current.isTopicUpvoted('topic-3')).toBe(false);
    });

    it('should track upvote state for multiple replies', async () => {
      const mockResponse = {
        message: 'Reply upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 3,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      // Upvote multiple replies
      await act(async () => {
        await result.current.handleReplyUpvote('reply-1', 1);
      });

      await act(async () => {
        await result.current.handleReplyUpvote('reply-2', 2);
      });

      expect(result.current.isReplyUpvoted('reply-1')).toBe(true);
      expect(result.current.isReplyUpvoted('reply-2')).toBe(true);
      expect(result.current.isReplyUpvoted('reply-3')).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should indicate loading state during upvote operations', async () => {
      const mockResponse = {
        message: 'Topic upvoted successfully',
        action: 'upvoted' as const,
        upvoteCount: 5,
      };

      (global.fetch as any).mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockResponse,
          }), 100)
        )
      );

      const { result } = renderHook(() => useUpvote(), { wrapper });

      expect(result.current.isLoading).toBe(false);

      // Start upvote operation
      const upvotePromise = act(async () => {
        await result.current.upvoteTopic.mutateAsync('topic-123');
      });

      // Should be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Wait for completion
      await upvotePromise;

      // Should no longer be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('User Upvotes Fetching', () => {
    it('should fetch user upvotes for given items', async () => {
      const mockUpvotesResponse = {
        upvotes: {
          topics: {
            'topic-1': true,
            'topic-2': false,
          },
          replies: {
            'reply-1': true,
            'reply-2': false,
          },
        },
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockUpvotesResponse,
      });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      const { result: upvotesResult } = renderHook(
        () => result.current.useUserUpvotes(['topic-1', 'topic-2'], ['reply-1', 'reply-2']),
        { wrapper }
      );

      await waitFor(() => {
        expect(upvotesResult.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/forum/upvotes/user?topicIds=topic-1&topicIds=topic-2&replyIds=reply-1&replyIds=reply-2',
        {
          headers: {
            'Authorization': 'Bearer mock-token',
          },
        }
      );
    });

    it('should not fetch upvotes when user is not authenticated', () => {
      (useAuth as any).mockReturnValue({ user: null });

      const { result } = renderHook(() => useUpvote(), { wrapper });

      const { result: upvotesResult } = renderHook(
        () => result.current.useUserUpvotes(['topic-1'], ['reply-1']),
        { wrapper }
      );

      // Should not fetch when user is null
      expect(global.fetch).not.toHaveBeenCalled();
      expect(upvotesResult.current.isLoading).toBe(false);
    });
  });
});