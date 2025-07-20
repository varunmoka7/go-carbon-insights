import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Use environment variable or fallback to localhost
const FORUM_API_BASE = import.meta.env.VITE_FORUM_API_BASE || 'http://localhost:3001';

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
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
      });

      newSocket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
        
        if (showToasts && onReconnect) {
          onReconnect();
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        
        if (showToasts && onDisconnect) {
          onDisconnect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setConnectionError(`Connection failed: ${error.message}`);
        setIsConnected(false);
        
        // Don't show toast for every connection error to avoid spam
        if (showToasts && reconnectAttempts.current === 0) {
          toast.error('Real-time updates unavailable');
        }
      });

      // Handle real-time events
      newSocket.on('topic:created', (event: TopicCreatedEvent) => {
        setLastEvent(event);
        queryClient.invalidateQueries({ queryKey: ['community-topics'] });
        
        if (showToasts) {
          toast.success(`New topic: ${event.title}`);
        }
      });

      newSocket.on('reply:created', (event: ReplyCreatedEvent) => {
        setLastEvent(event);
        queryClient.invalidateQueries({ queryKey: ['community-topics'] });
        queryClient.invalidateQueries({ queryKey: ['topic-replies', event.topicId] });
        
        if (showToasts) {
          toast.success(`New reply to: ${event.topicTitle}`);
        }
      });

      newSocket.on('report:created', (event: ReportCreatedEvent) => {
        setLastEvent(event);
        queryClient.invalidateQueries({ queryKey: ['moderation-reports'] });
        
        if (showToasts) {
          toast.warning(`New ${event.contentType} reported`);
        }
      });

      newSocket.on('moderation:action', (event: ModerationActionEvent) => {
        setLastEvent(event);
        queryClient.invalidateQueries({ queryKey: ['community-topics'] });
        queryClient.invalidateQueries({ queryKey: ['moderation-reports'] });
        
        if (showToasts) {
          toast.info(`Moderation action: ${event.actionType}`);
        }
      });

      newSocket.on('user:suspension', (event: UserSuspensionEvent) => {
        setLastEvent(event);
        queryClient.invalidateQueries({ queryKey: ['community-topics'] });
        
        if (showToasts) {
          const action = event.suspended ? 'suspended' : 'unsuspended';
          toast.info(`User ${event.username} ${action}`);
        }
      });

      return newSocket;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create connection');
      return null;
    }
  }, [user, getAuthToken, namespace, showToasts, onReconnect, onDisconnect, queryClient]);

  const connect = useCallback(() => {
    if (socket) {
      socket.connect();
    } else {
      const newSocket = createConnection();
      if (newSocket) {
        setSocket(newSocket);
      }
    }
  }, [socket, createConnection]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const reconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setConnectionError('Max reconnection attempts reached');
      return;
    }

    reconnectAttempts.current++;
    disconnect();
    
    setTimeout(() => {
      const newSocket = createConnection();
      if (newSocket) {
        setSocket(newSocket);
      }
    }, 1000 * reconnectAttempts.current);
  }, [disconnect, createConnection]);

  const joinRoom = useCallback((room: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', room);
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((room: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', room);
    }
  }, [socket, isConnected]);

  // Auto-connect when user is available
  useEffect(() => {
    if (autoConnect && user && !socket) {
      const newSocket = createConnection();
      if (newSocket) {
        setSocket(newSocket);
      }
    }
  }, [autoConnect, user, socket, createConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

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