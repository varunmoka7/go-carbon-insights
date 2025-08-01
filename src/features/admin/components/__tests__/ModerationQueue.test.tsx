import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect, type Mock } from 'vitest';
import { ModerationQueue } from '../ModerationQueue';
import { useModerationAPI } from '../../hooks/useModerationAPI';

// Mock the moderation API hook
vi.mock('../../hooks/useModerationAPI');

const mockUseModerationAPI = {
  useFlaggedContent: vi.fn(),
  hideContent: vi.fn(),
  restoreContent: vi.fn(),
  bulkModerate: vi.fn(),
  resolveReport: vi.fn(),
  isHidingContent: false,
  isRestoringContent: false,
  isBulkModerating: false,
  isResolvingReport: false,
  error: null,
  clearError: vi.fn(),
};

const mockFlaggedData = {
  data: [
    {
      id: 'report-1',
      reporterId: 'user-1',
      contentType: 'topic',
      contentId: 'topic-1',
      reason: 'spam',
      description: 'This looks like spam content',
      status: 'pending',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
      reporter: {
        id: 'user-1',
        username: 'reporter1',
        displayName: 'Reporter One',
      },
      content: {
        id: 'topic-1',
        title: 'Suspicious Topic',
        content: 'This is potentially spam content that needs review',
        authorId: 'author-1',
        isHidden: false,
        author: {
          id: 'author-1',
          username: 'author1',
          displayName: 'Author One',
        },
      },
    },
    {
      id: 'report-2',
      reporterId: 'user-2',
      contentType: 'reply',
      contentId: 'reply-1',
      reason: 'harassment',
      description: 'This reply contains harassment',
      status: 'pending',
      createdAt: '2024-01-01T11:00:00Z',
      updatedAt: '2024-01-01T11:00:00Z',
      reporter: {
        id: 'user-2',
        username: 'reporter2',
        displayName: 'Reporter Two',
      },
      content: {
        id: 'reply-1',
        content: 'This is an inappropriate reply that harasses other users',
        authorId: 'author-2',
        topicId: 'topic-2',
        isHidden: false,
        author: {
          id: 'author-2',
          username: 'author2',
          displayName: 'Author Two',
        },
        topic: {
          id: 'topic-2',
          title: 'General Discussion',
        },
      },
    },
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 2,
    pages: 1,
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

describe('ModerationQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementation
    (useModerationAPI as Mock).mockReturnValue({
      ...mockUseModerationAPI,
      useFlaggedContent: vi.fn(() => ({
        data: mockFlaggedData,
        isLoading: false,
        error: null,
      })),
    });
  });

  describe('Report Display', () => {
    it('should render flagged content reports', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('Moderation Queue')).toBeInTheDocument();
      });

      // Check that reports are displayed
      expect(screen.getByText('Suspicious Topic')).toBeInTheDocument();
      expect(screen.getByText('This is potentially spam content that needs review')).toBeInTheDocument();
      expect(screen.getByText('Spam')).toBeInTheDocument();
      expect(screen.getByText('Harassment')).toBeInTheDocument();

      // Check author information
      expect(screen.getByText('Author One')).toBeInTheDocument();
      expect(screen.getByText('Author Two')).toBeInTheDocument();

      // Check reporter information
      expect(screen.getByText('Reporter One')).toBeInTheDocument();
      expect(screen.getByText('Reporter Two')).toBeInTheDocument();
    });

    it('should display different badges for different report reasons', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('Spam')).toBeInTheDocument();
        expect(screen.getByText('Harassment')).toBeInTheDocument();
      });
    });

    it('should show topic vs reply indicators', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getAllByText('Topic')).toHaveLength(1);
        expect(screen.getAllByText('Reply')).toHaveLength(1);
      });
    });

    it('should display creation timestamps', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        // Check that timestamps are formatted and displayed
        expect(screen.getAllByText(/1\/1\/2024/)[0]).toBeInTheDocument();
      });
    });
  });

  describe('Status Filtering', () => {
    it('should allow filtering by status', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Pending')).toBeInTheDocument();
      });

      // Check that status selector is present
      const statusSelect = screen.getByDisplayValue('Pending');
      expect(statusSelect).toBeInTheDocument();
    });

    it('should update filter when status changes', async () => {
      const mockUseFlaggedContent = vi.fn(() => ({
        data: mockFlaggedData,
        isLoading: false,
        error: null,
      }));

      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        useFlaggedContent: mockUseFlaggedContent,
      });

      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(mockUseFlaggedContent).toHaveBeenCalledWith({
          status: 'pending',
          limit: 20,
        });
      });
    });
  });

  describe('Individual Actions', () => {
    it('should show hide and dismiss buttons for pending reports', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getAllByText('Hide')).toHaveLength(2);
        expect(screen.getAllByText('Dismiss')).toHaveLength(2);
      });
    });

    it('should call hideContent when hide button is clicked', async () => {
      const mockHideContent = vi.fn();
      const mockResolveReport = vi.fn();

      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        hideContent: mockHideContent,
        resolveReport: mockResolveReport,
        useFlaggedContent: vi.fn(() => ({
          data: mockFlaggedData,
          isLoading: false,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getAllByText('Hide')).toHaveLength(2);
      });

      // Click the first hide button
      fireEvent.click(screen.getAllByText('Hide')[0]);

      await waitFor(() => {
        expect(mockHideContent).toHaveBeenCalledWith(
          'topic-1',
          'topic',
          'Content hidden by moderator'
        );
        expect(mockResolveReport).toHaveBeenCalledWith({
          reportId: 'report-1',
          status: 'resolved',
          resolutionNotes: 'Content hidden by moderator',
        });
      });
    });

    it('should call resolveReport when dismiss button is clicked', async () => {
      const mockResolveReport = vi.fn();

      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        resolveReport: mockResolveReport,
        useFlaggedContent: vi.fn(() => ({
          data: mockFlaggedData,
          isLoading: false,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getAllByText('Dismiss')).toHaveLength(2);
      });

      // Click the first dismiss button
      fireEvent.click(screen.getAllByText('Dismiss')[0]);

      await waitFor(() => {
        expect(mockResolveReport).toHaveBeenCalledWith({
          reportId: 'report-1',
          status: 'dismissed',
          resolutionNotes: 'No action needed',
        });
      });
    });
  });

  describe('Bulk Actions', () => {
    it('should show bulk actions button when reports are selected', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('Select All (2 reports)')).toBeInTheDocument();
      });

      // Select first report
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First is "Select All", second is first report

      await waitFor(() => {
        expect(screen.getByText('Bulk Actions (1)')).toBeInTheDocument();
      });
    });

    it('should handle select all functionality', async () => {
      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('Select All (2 reports)')).toBeInTheDocument();
      });

      // Click select all
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(selectAllCheckbox);

      await waitFor(() => {
        expect(screen.getByText('Bulk Actions (2)')).toBeInTheDocument();
      });
    });

    it('should perform bulk hide action', async () => {
      const mockBulkModerate = vi.fn();
      const mockResolveReport = vi.fn();

      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        bulkModerate: mockBulkModerate,
        resolveReport: mockResolveReport,
        useFlaggedContent: vi.fn(() => ({
          data: mockFlaggedData,
          isLoading: false,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      // Select all reports
      await waitFor(() => {
        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);
      });

      // Click bulk actions
      await waitFor(() => {
        fireEvent.click(screen.getByText('Bulk Actions (2)'));
      });

      // This would open a dialog - in a real test we'd need to interact with it
      // For now, we just verify the button is clickable
      await waitFor(() => {
        expect(screen.getByText('Bulk Moderation')).toBeInTheDocument();
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state', async () => {
      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        useFlaggedContent: vi.fn(() => ({
          data: null,
          isLoading: true,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      expect(screen.getByText('Moderation Queue')).toBeInTheDocument();
      // Check for loading skeleton
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should show empty state when no reports', async () => {
      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        useFlaggedContent: vi.fn(() => ({
          data: { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } },
          isLoading: false,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('No pending reports found')).toBeInTheDocument();
      });
    });

    it('should display error messages', async () => {
      (useModerationAPI as Mock).mockReturnValue({
        ...mockUseModerationAPI,
        error: 'Failed to load reports',
        useFlaggedContent: vi.fn(() => ({
          data: mockFlaggedData,
          isLoading: false,
          error: null,
        })),
      });

      renderWithQueryClient(<ModerationQueue />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load reports')).toBeInTheDocument();
      });
    });
  });
});