import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, MessageCircle } from 'lucide-react';
import type { ThreadedReply } from '../types';

interface ThreadedReplyFormProps {
  parentReply: ThreadedReply;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ThreadedReplyForm: React.FC<ThreadedReplyFormProps> = ({
  parentReply,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [content, setContent] = useState('');
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setLocalSubmitting(true);
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setLocalSubmitting(false);
    }
  };

  const isLoading = isSubmitting || localSubmitting;

  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="pt-4">
        {/* Reply Context */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MessageCircle className="h-4 w-4" />
          <span>Replying to</span>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="font-medium text-gray-900">
              {parentReply.author?.username || 'Unknown User'}
            </span>
          </div>
        </div>

        {/* Parent Reply Preview */}
        <div className="bg-white border-l-4 border-blue-200 pl-3 py-2 mb-4 text-sm text-gray-700">
          <div className="line-clamp-2">
            {parentReply.content}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Reply to ${parentReply.author?.username || 'this comment'}...`}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          
          {/* Character Counter */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{content.length} characters</span>
            {content.length > 1000 && (
              <span className="text-orange-600">
                Long reply - consider breaking into multiple comments
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              size="sm"
              disabled={!content.trim() || isLoading}
            >
              {isLoading ? 'Submitting...' : 'Reply'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};