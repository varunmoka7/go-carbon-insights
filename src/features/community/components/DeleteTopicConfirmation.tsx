import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, MessageCircle, Calendar } from 'lucide-react';
import type { Topic } from '../types';

interface DeleteTopicConfirmationProps {
  topic: Topic;
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
  error?: string | null;
}

export const DeleteTopicConfirmation: React.FC<DeleteTopicConfirmationProps> = ({
  topic,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
  error = null
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  const canDelete = confirmText.toUpperCase() === 'DELETE';

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setConfirmText(''); // Reset confirmation text
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (!canDelete || isDeleting) return;
    
    try {
      await onConfirm();
      setConfirmText(''); // Reset on success
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Topic
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The topic will be permanently removed from the community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Topic Info Card */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {topic.title}
            </h4>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count} {topic.reply_count === 1 ? 'reply' : 'replies'}</span>
              </div>
            </div>
            
            {topic.category && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                  {topic.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Warning Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This topic and all its replies will be permanently deleted. 
              This action cannot be undone.
            </AlertDescription>
          </Alert>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Type <strong>DELETE</strong> to confirm:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={isDeleting}
              className="font-mono"
              autoComplete="off"
            />
            <p className="text-sm text-gray-500">
              This confirmation helps prevent accidental deletions.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to delete topic: {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Topic'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};