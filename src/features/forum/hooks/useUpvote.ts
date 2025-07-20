import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useBadgeSystem } from './useBadgeSystem';

interface UpvoteResponse {
  message: string;
  action: 'upvoted' | 'removed';
  upvoteCount: number;
}

interface UserUpvotesResponse {
  upvotes: {
    topics: Record<string, boolean>;
    replies: Record<string, boolean>;
  };
}

export function useUpvote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { awardFirstLikeBadge, hasBadge } = useBadgeSystem();
  const [upvoteStates, setUpvoteStates] = useState<{
    topics: Record<string, boolean>;
    replies: Record<string, boolean>;
  }>({
    topics: {},
    replies: {}
  });

  const upvoteTopic = useMutation({
    mutationFn: async (topicId: string): Promise<UpvoteResponse> => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/forum/upvotes/topics/${topicId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upvote topic');
      }

      return response.json();
    },
    onSuccess: async (data, topicId) => {
      // Update local upvote state
      setUpvoteStates(prev => ({
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: data.action === 'upvoted'
        }
      }));

      // Award First Like badge if this is user's first upvote
      if (data.action === 'upvoted' && !hasBadge('First Like')) {
        try {
          await awardFirstLikeBadge();
        } catch (error) {
          console.error('Failed to award first like badge:', error);
        }
      }

      // Invalidate and refetch topics
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error) => {
      console.error('Upvote topic failed:', error);
    }
  });

  const upvoteReply = useMutation({
    mutationFn: async (replyId: string): Promise<UpvoteResponse> => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/forum/upvotes/replies/${replyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upvote reply');
      }

      return response.json();
    },
    onSuccess: async (data, replyId) => {
      // Update local upvote state
      setUpvoteStates(prev => ({
        ...prev,
        replies: {
          ...prev.replies,
          [replyId]: data.action === 'upvoted'
        }
      }));

      // Award First Like badge if this is user's first upvote
      if (data.action === 'upvoted' && !hasBadge('First Like')) {
        try {
          await awardFirstLikeBadge();
        } catch (error) {
          console.error('Failed to award first like badge:', error);
        }
      }

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
    onError: (error) => {
      console.error('Upvote reply failed:', error);
    }
  });

  // Fetch user's upvote status for multiple items
  const fetchUserUpvotes = async (topicIds: string[] = [], replyIds: string[] = []) => {
    if (!user || (topicIds.length === 0 && replyIds.length === 0)) {
      return { upvotes: { topics: {}, replies: {} } };
    }

    const params = new URLSearchParams();
    topicIds.forEach(id => params.append('topicIds', id));
    replyIds.forEach(id => params.append('replyIds', id));

    const response = await fetch(`/api/forum/upvotes/user?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user upvotes');
    }

    return response.json() as Promise<UserUpvotesResponse>;
  };

  // Hook to get upvote status for specific items
  const useUserUpvotes = (topicIds: string[] = [], replyIds: string[] = []) => {
    return useQuery({
      queryKey: ['user-upvotes', topicIds, replyIds],
      queryFn: () => fetchUserUpvotes(topicIds, replyIds),
      enabled: !!user && (topicIds.length > 0 || replyIds.length > 0),
    });
  };

  // Helper functions to check upvote status
  const isTopicUpvoted = (topicId: string): boolean => {
    return upvoteStates.topics[topicId] || false;
  };

  const isReplyUpvoted = (replyId: string): boolean => {
    return upvoteStates.replies[replyId] || false;
  };

  // Handle upvote with optimistic updates
  const handleTopicUpvote = async (topicId: string, currentUpvoteCount: number) => {
    const isCurrentlyUpvoted = isTopicUpvoted(topicId);
    
    // Optimistic update
    setUpvoteStates(prev => ({
      ...prev,
      topics: {
        ...prev.topics,
        [topicId]: !isCurrentlyUpvoted
      }
    }));

    try {
      await upvoteTopic.mutateAsync(topicId);
    } catch (error) {
      // Revert optimistic update on error
      setUpvoteStates(prev => ({
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: isCurrentlyUpvoted
        }
      }));
      throw error;
    }
  };

  const handleReplyUpvote = async (replyId: string, currentUpvoteCount: number) => {
    const isCurrentlyUpvoted = isReplyUpvoted(replyId);
    
    // Optimistic update
    setUpvoteStates(prev => ({
      ...prev,
      replies: {
        ...prev.replies,
        [replyId]: !isCurrentlyUpvoted
      }
    }));

    try {
      await upvoteReply.mutateAsync(replyId);
    } catch (error) {
      // Revert optimistic update on error
      setUpvoteStates(prev => ({
        ...prev,
        replies: {
          ...prev.replies,
          [replyId]: isCurrentlyUpvoted
        }
      }));
      throw error;
    }
  };

  return {
    upvoteTopic,
    upvoteReply,
    useUserUpvotes,
    isTopicUpvoted,
    isReplyUpvoted,
    handleTopicUpvote,
    handleReplyUpvote,
    isLoading: upvoteTopic.isPending || upvoteReply.isPending,
  };
}