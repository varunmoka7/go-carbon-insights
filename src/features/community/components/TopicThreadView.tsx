import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Edit, 
  Trash2,
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  Pin, 
  Lock, 
  Calendar,
  User,
  Tag,
  Clock
} from 'lucide-react';
import { useTopicThread } from '../hooks/useTopicThread';
import { useReplies } from '../hooks/useReplies';
import { EditTopicForm } from './EditTopicForm';
import { DeleteTopicConfirmation } from './DeleteTopicConfirmation';
import { TopicTombstone } from './TopicTombstone';
import { ThreadedReplyTree } from './ThreadedReplyTree';
import { ThreadedReplyForm } from './ThreadedReplyForm';
import LoadingFallback from '@/components/LoadingFallback';

interface TopicThreadViewProps {
  topicId: string;
}

export const TopicThreadView: React.FC<TopicThreadViewProps> = ({ topicId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTopLevelReplyForm, setShowTopLevelReplyForm] = useState(false);
  
  const {
    topic,
    isLoading: topicLoading,
    error: topicError,
    canEdit,
    canDelete,
    isEditing,
    editTopic,
    startEditing,
    cancelEditing,
    editError,
    isSaving,
    deleteTopic,
    deleteError,
    isDeleting
  } = useTopicThread(topicId);

  const {
    replies,
    isLoading: repliesLoading,
    error: repliesError,
    createReply,
    editReply,
    deleteReply,
    isCreatingReply,
    startEditingReply,
    cancelEditingReply,
    isEditingReply
  } = useReplies(topicId);

  // Delete handlers
  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleDeleteCancel = () => setShowDeleteConfirm(false);
  
  const handleDeleteConfirm = async () => {
    try {
      await deleteTopic();
      setShowDeleteConfirm(false);
      
      toast({
        title: "Topic deleted",
        description: "The topic has been successfully deleted.",
      });
      
      // Navigate back to community after successful deletion
      navigate('/community');
    } catch (error) {
      // Error is already handled by the hook
      console.error('Delete failed:', error);
    }
  };

  // Threaded reply handlers
  const handleReply = async (parentId: string | null, content: string) => {
    try {
      await createReply(content, parentId);
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReply = async (replyId: string, content: string) => {
    try {
      await editReply(replyId, { content });
      toast({
        title: "Reply updated",
        description: "Your reply has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteReply(replyId);
      toast({
        title: "Reply deleted",
        description: "The reply has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTopLevelReplySubmit = async (content: string) => {
    try {
      await createReply(content, null);
      setShowTopLevelReplyForm(false);
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (topicLoading) {
    return <LoadingFallback message="Loading topic..." />;
  }

  if (topicError) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load topic: {topicError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!topic) {
    return (
      <Alert>
        <AlertDescription>
          Topic not found or has been removed.
        </AlertDescription>
      </Alert>
    );
  }

  // Show tombstone if topic is deleted
  if (topic.deleted_at) {
    return <TopicTombstone topic={topic} />;
  }

  if (isEditing) {
    return (
      <EditTopicForm
        topic={topic}
        onSave={async (updates) => { await editTopic(updates); }}
        onCancel={cancelEditing}
        isLoading={isSaving}
        error={editError}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Topic */}
      <Card>
        <CardHeader className="pb-3">
          {/* Topic Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {topic.is_pinned && (
                  <Pin className="h-4 w-4 text-blue-500" />
                )}
                {topic.is_locked && (
                  <Lock className="h-4 w-4 text-gray-500" />
                )}
                {topic.category && (
                  <Badge variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {topic.category.name}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {topic.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEditing}
                  disabled={topic.is_locked}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={topic.is_locked}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          {/* Topic Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="font-medium">
                {topic.author?.username || 'Unknown User'}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={topic.created_at}>
                {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
              </time>
            </div>

            {topic.updated_at !== topic.created_at && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  Edited {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true })}
                  {topic.edit_count && topic.edit_count > 1 && (
                    <span className="ml-1">({topic.edit_count} times)</span>
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{topic.view_count}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{topic.upvote_count}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Topic Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900">
              {topic.content}
            </div>
          </div>

          {/* Tags */}
          {topic.tags && topic.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {topic.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="space-y-6">
        {/* Reply Header with Action Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {replies.length > 0 
              ? `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`
              : 'Discussion'
            }
          </h2>
          
          {!topic.is_locked && (
            <Button
              onClick={() => setShowTopLevelReplyForm(true)}
              disabled={isCreatingReply}
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {replies.length === 0 ? 'Start Discussion' : 'Add Reply'}
            </Button>
          )}
        </div>

        {/* Top-level Reply Form */}
        {showTopLevelReplyForm && (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="pt-4">
              <ThreadedReplyForm
                parentReply={{
                  id: topicId,
                  author: topic.author,
                  content: topic.title,
                } as any}
                onSubmit={handleTopLevelReplySubmit}
                onCancel={() => setShowTopLevelReplyForm(false)}
                isSubmitting={isCreatingReply}
              />
            </CardContent>
          </Card>
        )}

        {repliesLoading && (
          <LoadingFallback message="Loading replies..." fullScreen={false} />
        )}
        
        {repliesError && (
          <Alert>
            <AlertDescription>
              Failed to load replies: {repliesError.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Threaded Replies */}
        {!repliesLoading && !repliesError && (
          <ThreadedReplyTree
            replies={replies}
            maxDepth={8}
            onReply={handleReply}
            onEdit={handleEditReply}
            onDelete={handleDeleteReply}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteTopicConfirmation
        topic={topic}
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};