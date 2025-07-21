import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit, 
  ThumbsUp, 
  User, 
  Calendar,
  Clock,
  Reply as ReplyIcon,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EditReplyForm } from './EditReplyForm';
import { ThreadedReplyForm } from './ThreadedReplyForm';
import { ReplyTombstone } from './ReplyTombstone';
import { DeleteReplyConfirmation } from './DeleteReplyConfirmation';
import type { ThreadedReply, ReplyUpdate } from '../types';

interface ThreadedReplyItemProps {
  reply: ThreadedReply;
  depth: number;
  maxDepth: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onReply: (parentId: string | null, content: string) => Promise<void>;
  onEdit: (replyId: string, content: string) => Promise<void>;
  onDelete: (replyId: string) => Promise<void>;
}

export const ThreadedReplyItem: React.FC<ThreadedReplyItemProps> = ({
  reply,
  depth,
  maxDepth,
  isCollapsed,
  onToggleCollapse,
  onReply,
  onEdit,
  onDelete
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();

  const hasChildren = reply.children && reply.children.length > 0;
  const shouldShowCollapse = hasChildren && reply.children!.length > 2;
  const isDeepNested = depth >= maxDepth;
  const canEdit = user?.id === reply.author_id && !reply.deleted_at;
  const canDelete = user?.id === reply.author_id && !reply.deleted_at;

  const handleReplySubmit = async (content: string) => {
    await onReply(reply.id, content);
    setShowReplyForm(false);
  };

  const handleEditSave = async (updates: ReplyUpdate) => {
    await onEdit(reply.id, updates.content);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(reply.id);
    setShowDeleteConfirm(false);
  };

  // Show tombstone if reply is deleted
  if (reply.deleted_at) {
    return (
      <div className="threaded-reply-item">
        {/* Threading connector lines */}
        {depth > 0 && (
          <div className="thread-connectors absolute left-0 top-0 bottom-0 pointer-events-none">
            {Array.from({ length: depth }, (_, i) => (
              <div 
                key={i} 
                className="thread-line absolute w-px bg-gray-200"
                style={{ 
                  left: `${i * 24 + 12}px`,
                  top: 0,
                  bottom: 0
                }}
              />
            ))}
          </div>
        )}

        {/* Reply tombstone */}
        <div 
          className="reply-content relative"
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <ReplyTombstone 
            reply={reply} 
            depth={depth}
            hasChildren={hasChildren}
          />
        </div>

        {/* Nested children */}
        {hasChildren && !isCollapsed && !isDeepNested && (
          <div className="nested-replies mt-4 space-y-4">
            {reply.children!.map(childReply => (
              <ThreadedReplyItem
                key={childReply.id}
                reply={childReply}
                depth={depth + 1}
                maxDepth={maxDepth}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="threaded-reply-item">
      {/* Threading connector lines */}
      {depth > 0 && (
        <div className="thread-connectors absolute left-0 top-0 bottom-0 pointer-events-none">
          {Array.from({ length: depth }, (_, i) => (
            <div 
              key={i} 
              className="thread-line absolute w-px bg-gray-200"
              style={{ 
                left: `${i * 24 + 12}px`,
                top: 0,
                bottom: 0
              }}
            />
          ))}
        </div>
      )}

      {/* Reply content */}
      <div 
        className="reply-content relative"
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <Card className="group">
          <CardContent className="pt-4">
            {/* Collapse toggle for threads with children */}
            {shouldShowCollapse && (
              <button
                onClick={onToggleCollapse}
                className="collapse-toggle absolute -left-6 top-4 p-1 hover:bg-gray-100 rounded text-gray-500"
                aria-label={isCollapsed ? "Expand thread" : "Collapse thread"}
              >
                {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
            )}

            {isEditing ? (
              <EditReplyForm
                reply={reply}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            ) : (
              <>
                {/* Reply Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-gray-900">
                        {reply.author?.username || 'Unknown User'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={reply.created_at}>
                        {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                      </time>
                    </div>

                    {/* Edit Indicator */}
                    {reply.updated_at !== reply.created_at && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          edited {formatDistanceToNow(new Date(reply.updated_at), { addSuffix: true })}
                          {reply.edit_count && reply.edit_count > 1 && (
                            <span className="ml-1">({reply.edit_count} times)</span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Threading depth indicator */}
                    {depth > 0 && (
                      <div className="text-xs text-gray-400">
                        Depth: {depth}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{reply.upvote_count}</span>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplyForm(true)}
                        className="text-xs"
                      >
                        <ReplyIcon className="h-3 w-3 mr-1" />
                        Reply
                      </Button>

                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900">
                    {reply.content}
                  </div>
                </div>
              </>
            )}

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-4 pt-4 border-t">
                <ThreadedReplyForm
                  parentReply={reply}
                  onSubmit={handleReplySubmit}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nested children */}
      {hasChildren && !isCollapsed && !isDeepNested && (
        <div className="nested-replies mt-4 space-y-4">
          {reply.children!.map(childReply => (
            <ThreadedReplyItem
              key={childReply.id}
              reply={childReply}
              depth={depth + 1}
              maxDepth={maxDepth}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Deep nesting indicator */}
      {isDeepNested && hasChildren && (
        <div className="deep-thread-indicator mt-4 ml-6">
          <Button
            variant="link"
            size="sm"
            className="text-blue-600 p-0 h-auto"
            onClick={() => {/* TODO: Open in modal or new view */}}
          >
            Continue this thread ({reply.children!.length} more replies) →
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteReplyConfirmation
        reply={reply}
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        hasChildren={hasChildren}
      />
    </div>
  );
};