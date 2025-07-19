import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const FORUM_API_BASE = process.env.REACT_APP_FORUM_API_URL || 'http://localhost:3001/api';

interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
}

export const useSSE = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? `Bearer ${token}` : '';
  };

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return; // Already connected
    }

    const token = getAuthHeaders();
    if (!token) {
      setConnectionError('No authentication token found');
      return;
    }

    try {
      // EventSource doesn't support custom headers, so we'll use URL params for auth
      // This is a limitation of SSE - in production, consider using WebSockets for better auth
      const url = new URL(`${FORUM_API_BASE}/events/stream`);
      
      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connected');
        setIsConnected(true);
        setConnectionError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const eventData: SSEEvent = JSON.parse(event.data);
          setLastEvent(eventData);
          
          // Handle different event types
          switch (eventData.type) {
            case 'moderation_action':
              // Invalidate moderation queries
              queryClient.invalidateQueries({ queryKey: ['moderation'] });
              break;
              
            case 'content_report':
              // Invalidate reports queries
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              break;
              
            case 'report_resolved':
              // Invalidate reports queries
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              break;
              
            case 'user_suspension':
              // Invalidate user and moderation queries
              queryClient.invalidateQueries({ queryKey: ['users'] });
              queryClient.invalidateQueries({ queryKey: ['moderation'] });
              break;
              
            default:
              console.log('Unknown SSE event type:', eventData.type);
          }
        } catch (error) {
          console.error('Error parsing SSE event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        setConnectionError('Connection error');
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            eventSource.close();
            eventSourceRef.current = null;
            connect();
          }
        }, 5000);
      };

    } catch (error) {
      console.error('Error creating SSE connection:', error);
      setConnectionError('Failed to establish connection');
    }
  }, [queryClient]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect when auth token changes
  useEffect(() => {
    const token = getAuthHeaders();
    if (token && !isConnected && !eventSourceRef.current) {
      connect();
    } else if (!token && eventSourceRef.current) {
      disconnect();
    }
  }, [connect, disconnect, isConnected]);

  return {
    isConnected,
    lastEvent,
    connectionError,
    connect,
    disconnect,
  };
};