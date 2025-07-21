import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit, 
  ThumbsUp, 
  User, 
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EditReplyForm } from './EditReplyForm';
import type { Reply, ReplyUpdate } from '../types';

interface ReplyItemProps {
  reply: Reply;
  onEdit: (replyId: string, updates: ReplyUpdate) => Promise<void>;
  isEditing?: boolean;
  onStartEdit?: (replyId: string) => void;
  onCancelEdit?: () => void;
}

export const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  onEdit,
  isEditing = false,
  onStartEdit,
  onCancelEdit
}) => {
  const { user } = useAuth();
  const canEdit = user?.id === reply.author_id;

  const handleEditStart = () => {
    onStartEdit?.(reply.id);
  };

  const handleEditSave = async (updates: ReplyUpdate) => {
    await onEdit(reply.id, updates);
  };

  const handleEditCancel = () => {
    onCancelEdit?.();
  };

  return (
    <Card className="group">
      <CardContent className="pt-4">
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
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{reply.upvote_count}</span>
                </div>

                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditStart}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    <span className="text-xs">Edit</span>
                  </Button>
                )}
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
      </CardContent>
    </Card>
  );
};