import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MetricsOverview } from '../components/MetricsOverview';
import { ReportsList } from '../components/ReportsList';
import { useSSE } from '../hooks/useSSE';

export const AdminDashboard: React.FC = () => {
  const { isConnected, lastEvent, connectionError } = useSSE();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Monitor forum activity, moderation actions, and user reports.
          </p>
        </div>
        
        {/* Real-time connection status */}
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </Badge>
          {lastEvent && (
            <Badge variant="outline" className="text-xs">
              Last event: {new Date(lastEvent.timestamp).toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Connection error alert */}
      {connectionError && (
        <Alert variant="destructive">
          <AlertDescription>
            Real-time updates unavailable: {connectionError}
          </AlertDescription>
        </Alert>
      )}

      <MetricsOverview />
      
      <ReportsList />
    </div>
  );
};