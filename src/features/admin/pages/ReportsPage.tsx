import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  Filter,
  Download,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReportsAPI } from '../hooks/useReportsAPI';

const reasonColors = {
  spam: 'bg-red-100 text-red-800',
  harassment: 'bg-orange-100 text-orange-800',
  inappropriate: 'bg-yellow-100 text-yellow-800',
  misinformation: 'bg-purple-100 text-purple-800',
  copyright: 'bg-blue-100 text-blue-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800',
};

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    reason: '',
    contentType: '',
    page: 1,
  });

  const { 
    usePendingReports, 
    useAllReports, 
    reportStats, 
    isLoading: statsLoading 
  } = useReportsAPI();

  const { data: pendingData, isLoading: pendingLoading } = usePendingReports(filters);
  const { data: allReportsData, isLoading: allLoading } = useAllReports({
    ...filters,
    status: activeTab === 'all' ? undefined : activeTab,
  });

  const currentData = activeTab === 'pending' ? pendingData : allReportsData;
  const currentLoading = activeTab === 'pending' ? pendingLoading : allLoading;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Icon className={`h-8 w-8 ${color}`} />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-12" /> : value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Reports</h2>
          <p className="text-muted-foreground">
            Manage and review user-reported content.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Pending Reports"
          value={reportStats?.byStatus.find(s => s.status === 'pending')?.count || 0}
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <StatCard
          title="Resolved Reports"
          value={reportStats?.byStatus.find(s => s.status === 'resolved')?.count || 0}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Dismissed Reports"
          value={reportStats?.byStatus.find(s => s.status === 'dismissed')?.count || 0}
          icon={XCircle}
          color="text-gray-600"
        />
        <StatCard
          title="Recent Reports"
          value={reportStats?.recentCount || 0}
          icon={BarChart3}
          color="text-blue-600"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Reason</label>
              <Select
                value={filters.reason}
                onValueChange={(value) => handleFilterChange('reason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All reasons</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate</SelectItem>
                  <SelectItem value="misinformation">Misinformation</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Content Type</label>
              <Select
                value={filters.contentType}
                onValueChange={(value) => handleFilterChange('contentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="topic">Topics</SelectItem>
                  <SelectItem value="reply">Replies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          <TabsTrigger value="all">All Reports</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {currentLoading ? (
                <div className="p-6 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !currentData?.data.length ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground">
                    No reports match your current filters.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.data.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono text-xs">
                          {report.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {report.contentType}
                            </Badge>
                            {report.contentDetails?.title && (
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {report.contentDetails.title}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {report.contentDetails?.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={reasonColors[report.reason]}>
                            {report.reason}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.reporter?.displayName || report.reporter?.username || 'Anonymous'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[report.status]}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(report.createdAt), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};