import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useReportsAPI } from '../hooks/useReportsAPI';
import type { ContentReport } from '../types';

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

interface ResolveDialogProps {
  report: ContentReport | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (reportId: string, status: 'resolved' | 'dismissed', notes?: string) => void;
  isLoading: boolean;
}

const ResolveDialog: React.FC<ResolveDialogProps> = ({
  report,
  isOpen,
  onClose,
  onResolve,
  isLoading,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (status: 'resolved' | 'dismissed') => {
    if (report) {
      onResolve(report.id, status, resolutionNotes);
      setResolutionNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resolve Report</DialogTitle>
          <DialogDescription>
            Review and resolve this content report.
          </DialogDescription>
        </DialogHeader>

        {report && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Reason</Label>
                <Badge className={reasonColors[report.reason]}>
                  {report.reason}
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Content Type</Label>
                <p className="text-muted-foreground capitalize">{report.contentType}</p>
              </div>
            </div>

            {report.description && (
              <div>
                <Label className="font-medium">Reporter's Description</Label>
                <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                  {report.description}
                </p>
              </div>
            )}

            {report.contentDetails && (
              <div>
                <Label className="font-medium">Reported Content</Label>
                <div className="bg-gray-50 p-3 rounded">
                  {report.contentDetails.title && (
                    <h4 className="font-medium mb-2">{report.contentDetails.title}</h4>
                  )}
                  <p className="text-sm mb-2">{report.contentDetails.content}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {report.contentDetails.author.displayName || report.contentDetails.author.username}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="resolutionNotes">Resolution Notes (Optional)</Label>
              <Textarea
                id="resolutionNotes"
                placeholder="Add any notes about your decision..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleResolve('dismissed')}
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button
            onClick={() => handleResolve('resolved')}
            disabled={isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ReportsList: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { usePendingReports, resolveReport, isResolvingReport } = useReportsAPI();
  const { data: reportsData, isLoading, error } = usePendingReports({ page, limit: 10 });

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed', notes?: string) => {
    resolveReport({ reportId, status, resolutionNotes: notes });
  };

  const openResolveDialog = (report: ContentReport) => {
    setSelectedReport(report);
    setResolveDialogOpen(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Error loading reports: {error?.message || 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Pending Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !reportsData?.data.length ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">No pending reports!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsData.data.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {report.contentType}
                          </Badge>
                          {report.contentDetails?.title && (
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {report.contentDetails.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={reasonColors[report.reason]}>
                        {report.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {report.reporter?.displayName || report.reporter?.username || 'Anonymous'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(report.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openResolveDialog(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review & Resolve
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportsData && reportsData.pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {reportsData.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === reportsData.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ResolveDialog
        report={selectedReport}
        isOpen={resolveDialogOpen}
        onClose={() => setResolveDialogOpen(false)}
        onResolve={handleResolve}
        isLoading={isResolvingReport}
      />
    </>
  );
};