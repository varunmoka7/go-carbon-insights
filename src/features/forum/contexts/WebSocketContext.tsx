import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'sonner';

interface WebSocketContextType {
  isConnected: boolean;
  connectionError: string | null;
  lastEvent: any;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const location = useLocation();
  const [currentRooms, setCurrentRooms] = useState<Set<string>>(new Set());
  
  const {
    isConnected,
    connectionError,
    lastEvent,
    joinRoom: wsJoinRoom,
    leaveRoom: wsLeaveRoom,
    reconnect,
  } = useWebSocket({
    namespace: '/forum',
    autoConnect: true,
    showToasts: false, // Disable toasts in context to avoid spam
    onReconnect: () => {
      console.log('WebSocket reconnected');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
  });

  // Auto-join/leave rooms based on current route
  useEffect(() => {
    const newRooms = new Set<string>();
    
    // Always join global forum room
    newRooms.add('forum:global');
    
    // Parse current route and join relevant rooms
    if (location.pathname.startsWith('/community/topic/')) {
      const topicId = location.pathname.split('/')[3];
      if (topicId && topicId !== 'new') {
        newRooms.add(`topic:${topicId}`);
      }
    } else if (location.pathname.startsWith('/community/category/')) {
      const categoryId = location.pathname.split('/')[3];
      if (categoryId) {
        newRooms.add(`category:${categoryId}`);
      }
    }
    
    // Leave rooms we're no longer in
    currentRooms.forEach(room => {
      if (!newRooms.has(room)) {
        wsLeaveRoom(room);
      }
    });
    
    // Join new rooms
    newRooms.forEach(room => {
      if (!currentRooms.has(room)) {
        wsJoinRoom(room);
      }
    });
    
    setCurrentRooms(newRooms);
  }, [location.pathname, wsJoinRoom, wsLeaveRoom, currentRooms]);

  // Handle connection errors with user-friendly messages
  useEffect(() => {
    if (connectionError) {
      console.warn('WebSocket connection error:', connectionError);
      
      // Only show toast for authentication errors
      if (connectionError.includes('Authentication')) {
        toast.error('Authentication failed - please refresh the page');
      }
    }
  }, [connectionError]);

  const joinRoom = (room: string) => {
    wsJoinRoom(room);
    setCurrentRooms(prev => new Set([...prev, room]));
  };

  const leaveRoom = (room: string) => {
    wsLeaveRoom(room);
    setCurrentRooms(prev => {
      const newSet = new Set(prev);
      newSet.delete(room);
      return newSet;
    });
  };

  const contextValue: WebSocketContextType = {
    isConnected,
    connectionError,
    lastEvent,
    joinRoom,
    leaveRoom,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    // Return a fallback context if WebSocket is not available
    return {
      isConnected: false,
      connectionError: 'WebSocket context not available',
      lastEvent: null,
      joinRoom: () => console.log('WebSocket not available'),
      leaveRoom: () => console.log('WebSocket not available'),
      reconnect: () => console.log('WebSocket not available'),
    };
  }
  return context;
};