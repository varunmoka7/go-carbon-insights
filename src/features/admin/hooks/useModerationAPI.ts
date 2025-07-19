import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModerationAction, ModerationMetrics, PaginatedResponse } from '../types';

const FORUM_API_BASE = 'http://localhost:3001/api';

interface SuspendUserData {
  userId: string;
  duration?: string;
  reason: string;
}

interface LogActionData {
  targetType: 'topic' | 'reply' | 'user';
  targetId: string;
  actionType: 'delete' | 'hide' | 'suspend' | 'warn' | 'pin' | 'unpin' | 'lock' | 'unlock' | 'restore';
  reason?: string;
  metadata?: Record<string, any>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const useModerationAPI = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get moderation metrics
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery<ModerationMetrics>({
    queryKey: ['moderation', 'metrics'],
    queryFn: async () => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/metrics`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch moderation metrics');
      }
      
      const data = await response.json();
      return data.metrics;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get moderation history
  const useModerationHistory = (filters: {
    targetType?: string;
    targetId?: string;
    actionType?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return useQuery<PaginatedResponse<ModerationAction>>({
      queryKey: ['moderation', 'history', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${FORUM_API_BASE}/moderation/history?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch moderation history');
        }

        const data = await response.json();
        return {
          data: data.actions,
          pagination: data.pagination,
        };
      },
    });
  };

  // Suspend user mutation
  const suspendUserMutation = useMutation({
    mutationFn: async (data: SuspendUserData) => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/suspend`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to suspend user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Unsuspend user mutation
  const unsuspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/unsuspend/${userId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unsuspend user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Log action mutation
  const logActionMutation = useMutation({
    mutationFn: async (data: LogActionData) => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/actions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log moderation action');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const suspendUser = useCallback(
    (data: SuspendUserData) => suspendUserMutation.mutate(data),
    [suspendUserMutation]
  );

  const unsuspendUser = useCallback(
    (userId: string, reason?: string) => unsuspendUserMutation.mutate({ userId, reason }),
    [unsuspendUserMutation]
  );

  const logAction = useCallback(
    (data: LogActionData) => logActionMutation.mutate(data),
    [logActionMutation]
  );

  return {
    // Data
    metrics,
    useModerationHistory,

    // Actions
    suspendUser,
    unsuspendUser,
    logAction,

    // States
    isLoading: metricsLoading,
    isSuspending: suspendUserMutation.isPending,
    isUnsuspending: unsuspendUserMutation.isPending,
    isLoggingAction: logActionMutation.isPending,

    // Errors
    error: error || metricsError?.message,
    clearError: () => setError(null),
  };
};