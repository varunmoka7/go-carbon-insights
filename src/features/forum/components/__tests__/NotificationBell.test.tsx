import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationBell from '../NotificationBell';
import { notificationService } from '@/api/NotificationService';

// Mock the notificationService
vi.mock('@/api/NotificationService', () => ({
  notificationService: {
    getNotifications: vi.fn(),
    subscribeToNotifications: vi.fn(),
    unsubscribeFromNotifications: vi.fn(),
    markAsRead: vi.fn(),
  },
}));

describe('NotificationBell', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementations
    (notificationService.getNotifications as vi.Mock).mockResolvedValue({ data: [] });
    (notificationService.subscribeToNotifications as vi.Mock).mockReturnValue({ unsubscribe: vi.fn() });
    (notificationService.markAsRead as vi.Mock).mockResolvedValue({});
  });

  it('renders the bell icon', () => {
    render(<NotificationBell userId={userId} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('fetches notifications on mount', async () => {
    const mockNotifications = [
      { 
        id: '1', 
        title: 'Test Title 1',
        message: 'Test notification 1', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'reply',
        from_user: {
          username: 'testuser',
          display_name: 'Test User',
          is_gct_team: false
        }
      },
      { 
        id: '2', 
        title: 'Test Title 2',
        message: 'Test notification 2', 
        is_read: true, 
        created_at: new Date().toISOString(),
        type: 'like',
        from_user: {
          username: 'testuser2',
          display_name: 'Test User 2',
          is_gct_team: false
        }
      },
    ];
    (notificationService.getNotifications as vi.Mock).mockResolvedValue({ data: mockNotifications });

    render(<NotificationBell userId={userId} />);

    await waitFor(() => {
      expect(notificationService.getNotifications).toHaveBeenCalledWith({ id: userId });
    });
  });

  it('displays the unread count', async () => {
    const mockNotifications = [
      { 
        id: '1', 
        title: 'Test Title 1',
        message: 'Test notification 1', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'reply',
        from_user: {
          username: 'testuser',
          display_name: 'Test User',
          is_gct_team: false
        }
      },
      { 
        id: '2', 
        title: 'Test Title 2',
        message: 'Test notification 2', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'like',
        from_user: {
          username: 'testuser2',
          display_name: 'Test User 2',
          is_gct_team: false
        }
      },
      { 
        id: '3', 
        title: 'Test Title 3',
        message: 'Test notification 3', 
        is_read: true, 
        created_at: new Date().toISOString(),
        type: 'mention',
        from_user: {
          username: 'testuser3',
          display_name: 'Test User 3',
          is_gct_team: false
        }
      },
    ];
    (notificationService.getNotifications as vi.Mock).mockResolvedValue({ data: mockNotifications });

    render(<NotificationBell userId={userId} />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('opens the dropdown on click', async () => {
    render(<NotificationBell userId={userId} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });

  it('marks a notification as read when clicked', async () => {
    const mockNotifications = [
      { 
        id: '1', 
        title: 'Test Title 1',
        message: 'Test notification 1', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'reply',
        from_user: {
          username: 'testuser',
          display_name: 'Test User',
          is_gct_team: false
        }
      },
    ];
    (notificationService.getNotifications as vi.Mock).mockResolvedValue({ data: mockNotifications });

    render(<NotificationBell userId={userId} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Test notification 1'));
    });

    await waitFor(() => {
      expect(notificationService.markAsRead).toHaveBeenCalledWith(['1'], { id: userId });
    });
  });

  it('marks all notifications as read', async () => {
    const mockNotifications = [
      { 
        id: '1', 
        title: 'Test Title 1',
        message: 'Test notification 1', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'reply',
        from_user: {
          username: 'testuser',
          display_name: 'Test User',
          is_gct_team: false
        }
      },
      { 
        id: '2', 
        title: 'Test Title 2',
        message: 'Test notification 2', 
        is_read: false, 
        created_at: new Date().toISOString(),
        type: 'like',
        from_user: {
          username: 'testuser2',
          display_name: 'Test User 2',
          is_gct_team: false
        }
      },
    ];
    (notificationService.getNotifications as vi.Mock).mockResolvedValue({ data: mockNotifications });

    render(<NotificationBell userId={userId} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Mark all read'));
    });

    await waitFor(() => {
      expect(notificationService.markAsRead).toHaveBeenCalledWith(['1', '2'], { id: userId });
    });
  });
});
