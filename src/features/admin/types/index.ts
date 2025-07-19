export interface ModerationAction {
  id: string;
  moderatorId?: string;
  targetType: 'topic' | 'reply' | 'user';
  targetId: string;
  actionType: 'delete' | 'hide' | 'suspend' | 'warn' | 'pin' | 'unpin' | 'lock' | 'unlock' | 'restore';
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  moderator?: {
    id: string;
    username: string;
    displayName?: string;
  };
}

export interface ContentReport {
  id: string;
  reporterId?: string;
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
  resolver?: {
    id: string;
    username: string;
    displayName?: string;
  };
  contentDetails?: {
    title?: string;
    content: string;
    author: {
      id: string;
      username: string;
      displayName?: string;
    };
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  role: 'user' | 'moderator' | 'admin';
  isActive: boolean;
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationMetrics {
  moderationActions: {
    total: number;
    recent: number;
  };
  contentReports: {
    total: number;
    pending: number;
  };
  users: {
    total: number;
    suspended: number;
    active: number;
  };
}

export interface ReportStats {
  byStatus: Array<{ status: string; count: number }>;
  byReason: Array<{ reason: string; count: number }>;
  recentCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}