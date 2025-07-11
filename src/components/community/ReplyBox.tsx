import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReplyBoxProps {
  topicId?: string;
  onReply: (content: string) => Promise<void>;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({
  topicId,
  onReply,
  isAuthenticated,
  onLoginRequired,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onReply(content.trim());
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!topicId) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a Topic
          </h3>
          <p className="text-gray-600">
            Choose a discussion topic to participate in the conversation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-emerald-200 bg-emerald-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          Share Your Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <Textarea
            placeholder={
              isAuthenticated
                ? "Share your experience, ask questions, or provide insights... (Ctrl+Enter to submit)"
                : "Please sign in to participate in discussions"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] resize-none"
            disabled={!isAuthenticated || isSubmitting}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isAuthenticated ? (
                <span>💡 Share your carbon tracking expertise with the community</span>
              ) : (
                <span>🔐 Sign in to join the conversation</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={onLoginRequired}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Sign In
                </Button>
              )}
              
              <Button
                onClick={handleSubmit}
                disabled={!isAuthenticated || !content.trim() || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  'Posting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="text-xs text-gray-500">
              Tip: Use Ctrl+Enter to submit quickly. Be respectful and constructive in your responses.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReplyBox;