import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'reply' | 'mention' | 'like' | 'topic_update' | 'upvote_received' | 'badge_awarded' | 'moderation_action' | 'reputation_milestone';
  title: string;
  message: string;
  content?: string;
  is_read: boolean;
  created_at: string;
  from_user: {
    username: string;
    display_name: string;
    is_gct_team: boolean;
  };
  topic?: {
    id: string;
    title: string;
  };
  data?: Record<string, any>;
}

export interface User {
  id: string;
}

class NotificationService {
  private baseUrl = 'http://localhost:3001/api';

  async getNotifications(user: User): Promise<{ data: Notification[] | null; error?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform backend format to frontend format
      const transformedNotifications = result.notifications?.map((notification: any) => ({
        id: notification.id,
        type: this.mapNotificationType(notification.type),
        title: notification.title,
        message: notification.content || notification.title,
        content: notification.content,
        is_read: notification.isRead,
        created_at: notification.createdAt,
        from_user: {
          username: notification.user?.username || 'System',
          display_name: notification.user?.username || 'System',
          is_gct_team: false,
        },
        topic: notification.data?.topicId ? {
          id: notification.data.topicId,
          title: notification.data.topicTitle || notification.data.contentTitle || 'Topic',
        } : undefined,
        data: notification.data,
      })) || [];

      return { data: transformedNotifications };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  }

  async markAsRead(notificationIds: string[], user: User): Promise<{ error?: any }> {
    try {
      const promises = notificationIds.map(async (notificationId) => {
        const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      });

      await Promise.all(promises);
      return {};
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return { error };
    }
  }

  subscribeToNotifications(user: User, callback: (payload: any) => void): any {
    // For now, we'll use a simple polling mechanism
    // In a real implementation, this would use WebSocket or Server-Sent Events
    const pollInterval = setInterval(async () => {
      try {
        const result = await this.getNotifications(user);
        if (result.data) {
          // This is a simplified implementation - in reality you'd want to track
          // which notifications are new and only call the callback for new ones
          const unreadNotifications = result.data.filter(n => !n.is_read);
          if (unreadNotifications.length > 0) {
            // For now, just call with the first unread notification
            // In a real implementation, you'd track and emit only new notifications
            callback({ new: unreadNotifications[0] });
          }
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 5000); // Poll every 5 seconds

    return { unsubscribe: () => clearInterval(pollInterval) };
  }

  unsubscribeFromNotifications(subscription: any): void {
    if (subscription && subscription.unsubscribe) {
      subscription.unsubscribe();
    }
  }

  private mapNotificationType(backendType: string): string {
    const typeMap: Record<string, string> = {
      'topic_reply': 'reply',
      'upvote_received': 'like',
      'badge_awarded': 'topic_update',
      'mention': 'mention',
      'moderation_action': 'topic_update',
      'reputation_milestone': 'topic_update',
    };

    return typeMap[backendType] || 'topic_update';
  }
}

export const notificationService = new NotificationService();