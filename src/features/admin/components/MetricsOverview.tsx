import React from 'react';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useModerationAPI } from '../hooks/useModerationAPI';
import { useReportsAPI } from '../hooks/useReportsAPI';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
            {trend && (
              <Badge 
                variant={trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'secondary'}
                className="ml-1"
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </Badge>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const MetricsOverview: React.FC = () => {
  const { metrics, isLoading: metricsLoading, error: metricsError } = useModerationAPI();
  const { reportStats, isLoading: statsLoading, error: statsError } = useReportsAPI();

  const pendingReports = reportStats?.byStatus.find(s => s.status === 'pending')?.count || 0;
  const resolvedReports = reportStats?.byStatus.find(s => s.status === 'resolved')?.count || 0;

  if (metricsError || statsError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Error loading metrics: {metricsError || statsError}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Pending Reports"
        value={pendingReports}
        subtitle={`${reportStats?.recentCount || 0} in last 30 days`}
        icon={AlertTriangle}
        trend={pendingReports > 5 ? 'up' : pendingReports > 0 ? 'neutral' : 'down'}
        isLoading={statsLoading}
      />
      
      <MetricCard
        title="Moderation Actions"
        value={metrics?.moderationActions.total || 0}
        subtitle={`${metrics?.moderationActions.recent || 0} recent actions`}
        icon={Shield}
        isLoading={metricsLoading}
      />
      
      <MetricCard
        title="Active Users"
        value={metrics?.users.active || 0}
        subtitle={`${metrics?.users.suspended || 0} suspended`}
        icon={Users}
        trend={metrics?.users.suspended ? (metrics.users.suspended > 0 ? 'up' : 'down') : 'neutral'}
        isLoading={metricsLoading}
      />
      
      <MetricCard
        title="Reports Resolved"
        value={resolvedReports}
        subtitle="All time"
        icon={Activity}
        isLoading={statsLoading}
      />
    </div>
  );
};