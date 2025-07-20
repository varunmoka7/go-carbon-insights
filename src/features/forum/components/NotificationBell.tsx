import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, MessageSquare, Heart, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: 'reply' | 'mention' | 'like' | 'topic_update';
  title: string;
  message: string;
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
}

import { notificationService } from '@/api/NotificationService';

interface NotificationBellProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  userId, 
  onNotificationClick 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    notificationService.getNotifications({ id: userId } as any).then(({ data }) => {
      if (data) {
        setNotifications(data as any);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
      setIsLoading(false);
    });

    const channel = notificationService.subscribeToNotifications({ id: userId } as any, (payload: any) => {
      const newNotification = payload.new as Notification;
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      notificationService.unsubscribeFromNotifications(channel as any);
    };
  }, [userId]);

  

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <Reply className="h-4 w-4 text-blue-500" />;
      case 'mention':
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = async (notificationId: string) => {
    notificationService.markAsRead([notificationId], { id: userId } as any);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    notificationService.markAsRead(unreadIds, { id: userId } as any);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 p-0"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-96 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No notifications yet</p>
                <p className="text-sm">We'll notify you when something happens!</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.is_read ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            
                            {notification.from_user.is_gct_team && (
                              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                                GCT Expert
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;