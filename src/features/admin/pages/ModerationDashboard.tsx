import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity, 
  Ban, 
  UserX, 
  Clock, 
  CheckCircle,
  Search,
  Eye,
  BarChart3
} from 'lucide-react';
import { ModerationQueue } from '../components/ModerationQueue';
import { MetricsOverview } from '../components/MetricsOverview';
import { useModerationAPI } from '../hooks/useModerationAPI';
import { useSSE } from '../hooks/useSSE';

export const ModerationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('queue');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('');

  const { isConnected, lastEvent, connectionError } = useSSE();
  const {
    metrics,
    useModerationHistory,
    suspendUser,
    unsuspendUser,
    isSuspending,
    isUnsuspending,
    error,
    clearError
  } = useModerationAPI();

  const { data: historyData, isLoading: historyLoading } = useModerationHistory({
    page: 1,
    limit: 10
  });

  const recentActions = historyData?.data || [];

  const handleSuspendUser = async () => {
    if (!selectedUserId || !suspendReason) return;

    await suspendUser({
      userId: selectedUserId,
      reason: suspendReason,
      duration: suspendDuration || 'permanent'
    });

    setSuspendDialogOpen(false);
    setSelectedUserId('');
    setSuspendReason('');
    setSuspendDuration('');
  };

  const handleUnsuspendUser = async (userId: string) => {
    await unsuspendUser(userId, 'Account reinstated by moderator');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderation Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage forum content, users, and community safety.
          </p>
        </div>
        
        {/* Real-time connection status */}
        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? '🟢 Live Updates' : '🔴 Offline'}
          </Badge>
          {lastEvent && (
            <Badge variant="outline" className="text-xs">
              Last: {new Date(lastEvent.timestamp).toLocaleTimeString()}
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

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Flagged Content
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Action Log
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Metrics
          </TabsTrigger>
        </TabsList>

        {/* Flagged Content Queue */}
        <TabsContent value="queue" className="space-y-4">
          <ModerationQueue />
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search users by username or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suspend User</DialogTitle>
                      <DialogDescription>
                        Temporarily or permanently restrict user access
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="User ID or username"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      />
                      <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Suspension duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="1d">1 Day</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Reason for suspension (required)"
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleSuspendUser}
                        disabled={!selectedUserId || !suspendReason || isSuspending}
                      >
                        {isSuspending ? 'Suspending...' : 'Suspend User'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <UserX className="w-4 h-4 mr-2" />
                  View Suspended Users
                </Button>
              </div>

              {/* Metrics Summary */}
              {metrics && (
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-2xl font-bold">{metrics.users.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-green-600">{metrics.users.active}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Suspended</p>
                          <p className="text-2xl font-bold text-red-600">{metrics.users.suspended}</p>
                        </div>
                        <Ban className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Log */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Moderation Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : recentActions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent moderation actions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActions.map((action: any) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {action.actionType.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary">
                              {action.targetType}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Reason:</strong> {action.reason || 'No reason provided'}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Moderator:</strong> {action.moderator?.displayName || action.moderator?.username}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(action.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Overview */}
        <TabsContent value="metrics" className="space-y-4">
          <MetricsOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};