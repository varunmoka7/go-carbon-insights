import React from 'react';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface WebSocketStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { isConnected, connectionError, lastEvent, reconnect } = useWebSocketContext();

  if (showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </div>
        
        {connectionError && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={reconnect}
                className="h-6 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connection error: {connectionError}</p>
              <p>Click to reconnect</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {lastEvent && (
          <Badge variant="outline" className="text-xs">
            Last: {new Date(lastEvent.data?.timestamp || Date.now()).toLocaleTimeString()}
          </Badge>
        )}
      </div>
    );
  }

  // Simple indicator
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center ${className}`}>
          {isConnected ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-red-600 font-medium">Offline</span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isConnected ? 'Real-time updates active' : 'Real-time updates unavailable'}</p>
        {connectionError && <p className="text-red-400">Error: {connectionError}</p>}
      </TooltipContent>
    </Tooltip>
  );
};