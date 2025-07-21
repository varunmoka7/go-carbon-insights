import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, MessageSquareX } from 'lucide-react';
import type { ThreadedReply } from '../types';

interface DeleteReplyConfirmationProps {
  reply: ThreadedReply;
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  hasChildren?: boolean;
  isDeleting?: boolean;
}

export const DeleteReplyConfirmation: React.FC<DeleteReplyConfirmationProps> = ({
  reply,
  isOpen,
  onConfirm,
  onCancel,
  hasChildren = false,
  isDeleting = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Delete confirmation error:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MessageSquareX className="h-5 w-5 text-red-600" />
            Delete Reply
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {hasChildren ? (
              <>
                <p>This reply has responses from other users.</p>
                <p>
                  Deleting it will replace your content with <span className="font-mono text-xs bg-gray-100 px-1 rounded">[deleted]</span>,
                  but the responses will remain visible to maintain the conversation flow.
                </p>
              </>
            ) : (
              <p>This reply will be permanently removed from the discussion.</p>
            )}
            
            <div className="mt-3 delete-reply-preview">
              <p className="font-medium mb-1 text-gray-800 dark:text-gray-200">Reply preview:</p>
              <p className="line-clamp-2">
                {reply.content.substring(0, 150)}
                {reply.content.length > 150 && '...'}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel} 
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Reply'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};