import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Upload, 
  Database, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  X,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import ImportUploadDialog from '../components/ImportUploadDialog';
import { ImportHistoryTable } from '../components/ImportHistoryTable';
import { ImportStatistics } from '../components/ImportStatistics';
import { ImportConfigurations } from '../components/ImportConfigurations';
import { useDataImportAPI } from '../hooks/useDataImportAPI';

const DataImportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const {
    imports,
    statistics,
    configurations,
    isLoading,
    error,
    refreshImports,
    refreshStatistics
  } = useDataImportAPI();

  useEffect(() => {
    refreshImports();
    refreshStatistics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
      case 'validating':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      case 'processing':
      case 'validating':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load import dashboard: {error}
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Import Management</h1>
            <p className="text-muted-foreground">
              Manage enterprise-scale ESG data imports and monitor system health
            </p>
          </div>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            New Import
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.totalImports || 0}</div>
              <p className="text-xs text-muted-foreground">
                {statistics?.completedImports || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.successRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Records Processed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(statistics?.totalRecordsProcessed || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.averageProcessingTime || '00:00:00'}</div>
              <p className="text-xs text-muted-foreground">
                Per import
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {statistics?.recentActivity?.map((activity: any) => (
                  <div key={activity.importId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.recordsProcessed?.toLocaleString()} records
                          {activity.status === 'processing' && activity.progressPercentage && (
                            <span> • {activity.progressPercentage}% complete</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      {activity.status === 'processing' && activity.progressPercentage && (
                        <div className="w-24">
                          <Progress value={activity.progressPercentage} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!statistics?.recentActivity || statistics.recentActivity.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent import activity
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Import History
            </TabsTrigger>
            <TabsTrigger value="configurations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ImportStatistics statistics={statistics} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <ImportHistoryTable 
              imports={imports} 
              isLoading={isLoading}
              onRefresh={refreshImports}
            />
          </TabsContent>

          <TabsContent value="configurations" className="space-y-4">
            <ImportConfigurations 
              configurations={configurations}
              onRefresh={refreshStatistics}
            />
          </TabsContent>
        </Tabs>

        {/* Upload Dialog */}
        <ImportUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onSuccess={() => {
            refreshImports();
            refreshStatistics();
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default DataImportDashboard;