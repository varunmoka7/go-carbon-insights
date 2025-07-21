export interface Topic {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  author_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_hidden: boolean;
  view_count: number;
  reply_count: number;
  upvote_count: number;
  tags?: string[];
  accepted_answer_id?: string;
  attachments?: any;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  edit_count?: number;
  last_edited_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  deletion_reason?: string;
  
  // Relations
  author?: {
    id: string;
    username?: string;
    avatar_url?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Reply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  upvote_count: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  edit_count?: number;
  last_edited_by?: string;
  
  // Threading fields
  parent_id?: string | null;
  thread_path?: string;
  depth: number;
  
  // Soft deletion fields
  deleted_at?: string | null;
  deleted_by?: string | null;
  
  // Relations
  author?: {
    id: string;
    username?: string;
    avatar_url?: string;
  };
}

export interface ThreadedReply extends Reply {
  children?: ThreadedReply[];
}

export interface TopicUpdate {
  title?: string;
  content?: string;
  category_id?: string;
}

export interface ReplyUpdate {
  content: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  is_private: boolean;
  topic_count: number;
  created_at: string;
}