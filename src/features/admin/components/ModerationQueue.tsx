import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, MessageSquare, FileText, User, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useModerationAPI } from '../hooks/useModerationAPI';

interface ContentReport {
  id: string;
  reporterId: string;
  contentType: 'topic' | 'reply';
  contentId: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'copyright' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  reporter?: {
    id: string;
    username: string;
    displayName?: string;
  };
  content?: {
    id: string;
    title?: string;
    content: string;
    authorId: string;
    isHidden: boolean;
    author?: {
      id: string;
      username: string;
      displayName?: string;
    };
    topic?: {
      id: string;
      title: string;
    };
  };
}

const REASON_LABELS = {
  spam: 'Spam',
  harassment: 'Harassment',
  inappropriate: 'Inappropriate Content',
  misinformation: 'Misinformation',
  copyright: 'Copyright Violation',
  other: 'Other'
};

const REASON_COLORS = {
  spam: 'bg-yellow-100 text-yellow-800',
  harassment: 'bg-red-100 text-red-800',
  inappropriate: 'bg-orange-100 text-orange-800',
  misinformation: 'bg-purple-100 text-purple-800',
  copyright: 'bg-blue-100 text-blue-800',
  other: 'bg-gray-100 text-gray-800'
};

export const ModerationQueue: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'hide' | 'restore' | ''>('');
  const [bulkReason, setBulkReason] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  const {
    useFlaggedContent,
    hideContent,
    restoreContent,
    bulkModerate,
    resolveReport,
    isHidingContent,
    isRestoringContent,
    isBulkModerating,
    isResolvingReport,
    error,
    clearError
  } = useModerationAPI();

  const { data: flaggedData, isLoading, error: fetchError } = useFlaggedContent({
    status: selectedStatus,
    limit: 20
  });

  const reports = flaggedData?.data || [];

  const handleSelectReport = (reportId: string, checked: boolean) => {
    const newSelected = new Set(selectedReports);
    if (checked) {
      newSelected.add(reportId);
    } else {
      newSelected.delete(reportId);
    }
    setSelectedReports(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(new Set(reports.map(r => r.id)));
    } else {
      setSelectedReports(new Set());
    }
  };

  const handleSingleAction = async (
    report: ContentReport, 
    action: 'hide' | 'restore', 
    reason: string = ''
  ) => {
    if (!report.content) return;

    if (action === 'hide') {
      await hideContent(report.content.id, report.contentType, reason);
    } else {
      await restoreContent(report.content.id, report.contentType, reason);
    }

    // Resolve the report
    await resolveReport({
      reportId: report.id,
      status: 'resolved',
      resolutionNotes: `Content ${action}d: ${reason}`
    });
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReports.size === 0) return;

    const targets = reports
      .filter(r => selectedReports.has(r.id) && r.content)
      .map(r => ({ id: r.content!.id, type: r.contentType }));

    await bulkModerate({
      action: bulkAction,
      targets,
      reason: bulkReason || `Bulk ${bulkAction} action`
    });

    // Resolve all selected reports
    for (const reportId of selectedReports) {
      await resolveReport({
        reportId,
        status: 'resolved',
        resolutionNotes: `Bulk ${bulkAction}: ${bulkReason}`
      });
    }

    setSelectedReports(new Set());
    setShowBulkDialog(false);
    setBulkAction('');
    setBulkReason('');
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed', notes: string = '') => {
    await resolveReport({
      reportId,
      status,
      resolutionNotes: notes
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Moderation Queue
          </CardTitle>
          <div className="flex items-center gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedReports.size > 0 && (
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedReports.size})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Moderation</DialogTitle>
                    <DialogDescription>
                      Apply action to {selectedReports.size} selected reports
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as 'hide' | 'restore')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hide">Hide Content</SelectItem>
                        <SelectItem value="restore">Restore Content</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Reason for action..."
                      value={bulkReason}
                      onChange={(e) => setBulkReason(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBulkAction}
                      disabled={!bulkAction || isBulkModerating}
                    >
                      {isBulkModerating ? 'Processing...' : 'Apply'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No {selectedStatus} reports found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All Header */}
            <div className="flex items-center gap-2 p-2 border-b">
              <Checkbox
                checked={selectedReports.size === reports.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select All ({reports.length} reports)
              </span>
            </div>

            {/* Reports List */}
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedReports.has(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {report.contentType === 'topic' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {report.contentType === 'topic' ? 'Topic' : 'Reply'}
                        </span>
                        <Badge className={REASON_COLORS[report.reason]}>
                          {REASON_LABELS[report.reason]}
                        </Badge>
                        {report.content?.isHidden && (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>

                      {/* Content Preview */}
                      {report.content && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                          {report.contentType === 'topic' && report.content.title && (
                            <h4 className="font-medium mb-1">{report.content.title}</h4>
                          )}
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {report.content.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {report.content.author?.displayName || report.content.author?.username}
                            </span>
                            {report.contentType === 'reply' && report.content.topic && (
                              <span>in "{report.content.topic.title}"</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Report Details */}
                      <div className="mt-3 text-sm text-gray-600">
                        <p><strong>Reported by:</strong> {report.reporter?.displayName || report.reporter?.username}</p>
                        {report.description && (
                          <p><strong>Description:</strong> {report.description}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedStatus === 'pending' && report.content && (
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSingleAction(report, 'hide', 'Content violates community guidelines')}
                        disabled={isHidingContent || isResolvingReport}
                      >
                        {report.content.isHidden ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Restore
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hide
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveReport(report.id, 'dismissed', 'No action needed')}
                        disabled={isResolvingReport}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {selectedStatus === 'resolved' && (
                    <div className="text-right text-sm">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                      {report.resolutionNotes && (
                        <p className="text-xs text-gray-500 mt-1">{report.resolutionNotes}</p>
                      )}
                    </div>
                  )}

                  {selectedStatus === 'dismissed' && (
                    <Badge variant="outline" className="text-gray-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      Dismissed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};