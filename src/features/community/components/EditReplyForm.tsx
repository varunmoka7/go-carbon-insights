import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';
import type { Reply, ReplyUpdate } from '../types';

interface EditReplyFormProps {
  reply: Reply;
  onSave: (updates: ReplyUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  maxLength?: number;
}

export const EditReplyForm: React.FC<EditReplyFormProps> = ({
  reply,
  onSave,
  onCancel,
  isLoading = false,
  maxLength = 5000
}) => {
  const [content, setContent] = useState(reply.content);
  const [error, setError] = useState<string | null>(null);
  
  const isValid = content.trim().length >= 10 && content.length <= maxLength;
  const remainingChars = maxLength - content.length;
  const hasChanges = content.trim() !== reply.content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !hasChanges || isLoading) return;
    
    setError(null);
    try {
      await onSave({ content: content.trim() });
    } catch (err: any) {
      setError(err.message || 'Failed to save reply');
    }
  };

  const handleCancel = () => {
    setContent(reply.content); // Reset content
    setError(null);
    onCancel();
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] pr-20 resize-y"
            placeholder="Edit your reply..."
            disabled={isLoading}
            autoFocus
          />
          <div className={`absolute bottom-2 right-2 text-xs ${
            remainingChars < 100 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {remainingChars} left
          </div>
        </div>

        {/* Validation Messages */}
        {content.trim().length < 10 && content.length > 0 && (
          <p className="text-sm text-red-600">
            Reply must be at least 10 characters
          </p>
        )}
        
        {content.length > maxLength && (
          <p className="text-sm text-red-600">
            Reply exceeds maximum length of {maxLength} characters
          </p>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || !hasChanges || isLoading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};