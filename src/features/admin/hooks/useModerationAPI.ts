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

interface BulkModerationData {
  action: 'hide' | 'restore';
  targets: Array<{ id: string; type: 'topic' | 'reply' }>;
  reason?: string;
}

interface ResolveReportData {
  reportId: string;
  status: 'resolved' | 'dismissed';
  resolutionNotes?: string;
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

  // Hide/restore content mutations
  const hideContentMutation = useMutation({
    mutationFn: async ({ id, type, reason }: { id: string; type: 'topic' | 'reply'; reason?: string }) => {
      const endpoint = type === 'topic' ? `topics/${id}/hide` : `replies/${id}/hide`;
      const response = await fetch(`${FORUM_API_BASE}/moderation/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to hide ${type}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const restoreContentMutation = useMutation({
    mutationFn: async ({ id, type, reason }: { id: string; type: 'topic' | 'reply'; reason?: string }) => {
      const endpoint = type === 'topic' ? `topics/${id}/restore` : `replies/${id}/restore`;
      const response = await fetch(`${FORUM_API_BASE}/moderation/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to restore ${type}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Bulk moderation mutation
  const bulkModerateMutation = useMutation({
    mutationFn: async (data: BulkModerationData) => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform bulk moderation');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: async (data: ResolveReportData) => {
      const response = await fetch(`${FORUM_API_BASE}/moderation/reports/${data.reportId}/resolve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: data.status, resolutionNotes: data.resolutionNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resolve report');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get flagged content
  const useFlaggedContent = (filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return useQuery({
      queryKey: ['moderation', 'flagged', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${FORUM_API_BASE}/moderation/flagged?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch flagged content');
        }

        const data = await response.json();
        return {
          data: data.reports,
          pagination: data.pagination,
        };
      },
    });
  };

  const hideContent = useCallback(
    (id: string, type: 'topic' | 'reply', reason?: string) => 
      hideContentMutation.mutate({ id, type, reason }),
    [hideContentMutation]
  );

  const restoreContent = useCallback(
    (id: string, type: 'topic' | 'reply', reason?: string) => 
      restoreContentMutation.mutate({ id, type, reason }),
    [restoreContentMutation]
  );

  const bulkModerate = useCallback(
    (data: BulkModerationData) => bulkModerateMutation.mutate(data),
    [bulkModerateMutation]
  );

  const resolveReport = useCallback(
    (data: ResolveReportData) => resolveReportMutation.mutate(data),
    [resolveReportMutation]
  );

  return {
    // Data
    metrics,
    useModerationHistory,
    useFlaggedContent,

    // Actions
    suspendUser,
    unsuspendUser,
    logAction,
    hideContent,
    restoreContent,
    bulkModerate,
    resolveReport,

    // States
    isLoading: metricsLoading,
    isSuspending: suspendUserMutation.isPending,
    isUnsuspending: unsuspendUserMutation.isPending,
    isLoggingAction: logActionMutation.isPending,
    isHidingContent: hideContentMutation.isPending,
    isRestoringContent: restoreContentMutation.isPending,
    isBulkModerating: bulkModerateMutation.isPending,
    isResolvingReport: resolveReportMutation.isPending,

    // Errors
    error: error || metricsError?.message,
    clearError: () => setError(null),
  };
};