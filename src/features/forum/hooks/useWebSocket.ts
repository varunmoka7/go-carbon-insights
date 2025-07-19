import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const FORUM_API_BASE = process.env.REACT_APP_FORUM_API_URL || 'http://localhost:3001';

// Event types based on our WebSocket contracts
interface WSEvent {
  timestamp: string;
  userId?: string;
}

interface TopicCreatedEvent extends WSEvent {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  authorUsername: string;
}

interface ReplyCreatedEvent extends WSEvent {
  id: string;
  topicId: string;
  topicTitle: string;
  content: string;
  authorUsername: string;
}

interface ReportCreatedEvent extends WSEvent {
  id: string;
  contentType: 'topic' | 'reply';
  reason: string;
}

interface ModerationActionEvent extends WSEvent {
  actionType: string;
  targetType: string;
  moderatorUsername: string;
  reason?: string;
}

interface UserSuspensionEvent extends WSEvent {
  username: string;
  suspended: boolean;
  reason?: string;
}

interface UseWebSocketOptions {
  namespace?: '/forum' | '/admin';
  autoConnect?: boolean;
  showToasts?: boolean;
  onReconnect?: () => void;
  onDisconnect?: () => void;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  lastEvent: any;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    namespace = '/forum',
    autoConnect = true,
    showToasts = true,
    onReconnect,
    onDisconnect,
  } = options;

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const getAuthToken = useCallback(() => {
    return localStorage.getItem('authToken') || '';
  }, []);

  const createConnection = useCallback(() => {
    if (!user) {
      setConnectionError('User not authenticated');
      return null;
    }

    const token = getAuthToken();
    if (!token) {
      setConnectionError('No authentication token found');
      return null;
    }

    try {
      const newSocket = io(`${FORUM_API_BASE}${namespace}`, {
        path: '/ws',
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      return newSocket;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create connection');
      return null;
    }
  }, [namespace, user, getAuthToken]);

  const setupEventListeners = useCallback((socketInstance: Socket) => {
    // Connection events
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;
      
      if (onReconnect && reconnectAttempts.current > 0) {
        onReconnect();
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      if (onDisconnect) {
        onDisconnect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
      reconnectAttempts.current++;
    });

    // Forum events
    socketInstance.on('topic:created', (data: TopicCreatedEvent) => {
      console.log('New topic created:', data);
      setLastEvent({ type: 'topic:created', data });
      
      // Invalidate topics queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      if (showToasts) {
        toast.success(`New topic: "${data.title}" by ${data.authorUsername}`);
      }
    });

    socketInstance.on('reply:created', (data: ReplyCreatedEvent) => {
      console.log('New reply created:', data);
      setLastEvent({ type: 'reply:created', data });
      
      // Invalidate specific topic and general replies queries
      queryClient.invalidateQueries({ queryKey: ['topics', data.topicId] });
      queryClient.invalidateQueries({ queryKey: ['replies', data.topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] }); // For reply counts
      
      if (showToasts) {
        toast.info(`New reply in "${data.topicTitle}" by ${data.authorUsername}`);
      }
    });

    socketInstance.on('report:created', (data: ReportCreatedEvent) => {
      console.log('New report created:', data);
      setLastEvent({ type: 'report:created', data });
      
      // Only show to admin/moderator users
      if (user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'moderator') {
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        
        if (showToasts) {
          toast.warning(`New ${data.contentType} reported for ${data.reason}`);
        }
      }
    });

    socketInstance.on('moderation:action', (data: ModerationActionEvent) => {
      console.log('Moderation action:', data);
      setLastEvent({ type: 'moderation:action', data });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      
      if (showToasts) {
        toast.info(`Moderation: ${data.actionType} by ${data.moderatorUsername}`);
      }
    });

    socketInstance.on('user:suspension', (data: UserSuspensionEvent) => {
      console.log('User suspension:', data);
      setLastEvent({ type: 'user:suspension', data });
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
      
      // If current user is suspended, show important notification
      if (data.username === user?.user_metadata?.username) {
        if (data.suspended) {
          toast.error(`Your account has been suspended. Reason: ${data.reason || 'No reason provided'}`);
        } else {
          toast.success('Your account suspension has been lifted');
        }
      } else if (showToasts) {
        const action = data.suspended ? 'suspended' : 'unsuspended';
        toast.info(`User ${data.username} ${action}`);
      }
    });

    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error);
      setConnectionError(error.message);
      
      if (showToasts) {
        toast.error(`Connection error: ${error.message}`);
      }
    });
  }, [queryClient, showToasts, onReconnect, onDisconnect, user]);

  const connect = useCallback(() => {
    if (socket?.connected) {
      return; // Already connected
    }

    const newSocket = createConnection();
    if (newSocket) {
      setupEventListeners(newSocket);
      setSocket(newSocket);
    }
  }, [socket, createConnection, setupEventListeners]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  const joinRoom = useCallback((room: string) => {
    if (socket?.connected) {
      socket.emit('join:room', room);
      console.log(`Joined room: ${room}`);
    }
  }, [socket]);

  const leaveRoom = useCallback((room: string) => {
    if (socket?.connected) {
      socket.emit('leave:room', room);
      console.log(`Left room: ${room}`);
    }
  }, [socket]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && user) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, user, connect, disconnect]);

  // Reconnect when auth token changes
  useEffect(() => {
    const token = getAuthToken();
    if (token && user && !socket?.connected) {
      connect();
    } else if (!token && socket) {
      disconnect();
    }
  }, [getAuthToken, user, socket, connect, disconnect]);

  return {
    socket,
    isConnected,
    connectionError,
    lastEvent,
    joinRoom,
    leaveRoom,
    connect,
    disconnect,
    reconnect,
  };
};