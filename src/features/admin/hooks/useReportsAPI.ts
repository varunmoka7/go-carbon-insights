import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentReport, ReportStats, PaginatedResponse } from '../types';

const FORUM_API_BASE = 'http://localhost:3001/api';

interface CreateReportData {
  contentType: 'topic' | 'reply';
  contentId: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'copyright' | 'other';
  description?: string;
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

export const useReportsAPI = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get pending reports
  const usePendingReports = (filters: {
    reason?: string;
    contentType?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return useQuery<PaginatedResponse<ContentReport>>({
      queryKey: ['reports', 'pending', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${FORUM_API_BASE}/reports/pending?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch pending reports');
        }

        const data = await response.json();
        return {
          data: data.reports,
          pagination: data.pagination,
        };
      },
      refetchInterval: 15000, // Refresh every 15 seconds
    });
  };

  // Get all reports
  const useAllReports = (filters: {
    status?: string;
    reason?: string;
    contentType?: string;
    reporterId?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return useQuery<PaginatedResponse<ContentReport>>({
      queryKey: ['reports', 'all', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${FORUM_API_BASE}/reports/all?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        return {
          data: data.reports,
          pagination: data.pagination,
        };
      },
    });
  };

  // Get report statistics
  const {
    data: reportStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<ReportStats>({
    queryKey: ['reports', 'stats'],
    queryFn: async () => {
      const response = await fetch(`${FORUM_API_BASE}/reports/stats`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report statistics');
      }

      const data = await response.json();
      return data.statistics;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data: CreateReportData) => {
      const response = await fetch(`${FORUM_API_BASE}/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create report');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, status, resolutionNotes }: ResolveReportData) => {
      const response = await fetch(`${FORUM_API_BASE}/reports/${reportId}/resolve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, resolutionNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resolve report');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const createReport = useCallback(
    (data: CreateReportData) => createReportMutation.mutate(data),
    [createReportMutation]
  );

  const resolveReport = useCallback(
    (data: ResolveReportData) => resolveReportMutation.mutate(data),
    [resolveReportMutation]
  );

  return {
    // Data
    usePendingReports,
    useAllReports,
    reportStats,

    // Actions
    createReport,
    resolveReport,

    // States
    isLoading: statsLoading,
    isCreatingReport: createReportMutation.isPending,
    isResolvingReport: resolveReportMutation.isPending,

    // Errors
    error: error || statsError?.message,
    clearError: () => setError(null),
  };
};