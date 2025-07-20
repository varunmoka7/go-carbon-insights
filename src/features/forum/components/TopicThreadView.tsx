import React from 'react';
import { ArrowLeft, Heart, MessageSquare, Eye, Clock, User, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTopicThread } from '../hooks/useTopicThread';
import { useUpvote } from '../hooks/useUpvote';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface TopicThreadViewProps {
  topicId: string;
  onBackToTopics: () => void;
}

const TopicThreadView: React.FC<TopicThreadViewProps> = ({ topicId, onBackToTopics }) => {
  const { user } = useAuth();
  const { 
    topic, 
    replies, 
    loading, 
    repliesLoading, 
    error, 
    submittingReply,
    createReply 
  } = useTopicThread(topicId);
  
  const { 
    isTopicUpvoted, 
    isReplyUpvoted, 
    handleTopicUpvote, 
    handleReplyUpvote,
    isLoading: upvoteLoading 
  } = useUpvote();

  const [replyContent, setReplyContent] = React.useState('');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleLikeTopic = async () => {
    if (!user || !topic) return;
    
    try {
      await handleTopicUpvote(topic.id, topic.upvote_count);
    } catch (error) {
      console.error('Failed to like topic:', error);
    }
  };

  const handleLikeReply = async (replyId: string, upvoteCount: number) => {
    if (!user) return;
    
    try {
      await handleReplyUpvote(replyId, upvoteCount);
    } catch (error) {
      console.error('Failed to like reply:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      await createReply({ content: replyContent.trim() });
      setReplyContent('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={onBackToTopics}
          className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              {error || 'Topic not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const authorName = topic.author?.display_name || topic.author?.username || 'Unknown';
  const isTopicLiked = isTopicUpvoted(topic.id);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBackToTopics}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Topics
      </Button>

      {/* Main Topic Post */}
      <Card className="mb-6 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          {/* Topic Header */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {topic.category && (
              <>
                <span 
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: topic.category.color || '#6366f1' }}
                />
                <Badge variant="outline" className="text-xs">
                  {topic.category.name}
                </Badge>
              </>
            )}
            
            {topic.is_pinned && (
              <Badge className="bg-blue-600 text-white text-xs">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-auto">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(topic.created_at)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {topic.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
              {getInitials(authorName)}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {authorName}
              </span>
              {topic.author?.is_gct_team && (
                <Badge variant="outline" className="ml-2 text-xs border-emerald-500 text-emerald-600">
                  Team
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {topic.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleLikeTopic}
              variant={isTopicLiked ? "default" : "outline"}
              size="sm"
              disabled={!user || upvoteLoading}
              className={isTopicLiked ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-50 dark:hover:bg-red-950"}
              title={user ? (isTopicLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
              <Heart className={`w-4 h-4 mr-2 ${isTopicLiked ? 'fill-current' : ''}`} />
              {topic.upvote_count || 0}
            </Button>
            
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>{topic.reply_count || 0} replies</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{topic.view_count || 0} views</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Replies ({replies.length})
        </h2>
        
        {repliesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply) => {
              const replyAuthorName = reply.author?.display_name || reply.author?.username || 'Unknown';
              const isReplyLiked = isReplyUpvoted(reply.id);
              
              return (
                <Card key={reply.id} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    {/* Reply Author */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {getInitials(replyAuthorName)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {replyAuthorName}
                        </span>
                        {reply.author?.is_gct_team && (
                          <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-600">
                            Team
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(reply.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Reply Content */}
                    <div className="mb-3">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>

                    {/* Reply Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleLikeReply(reply.id, reply.upvote_count)}
                        variant={isReplyLiked ? "default" : "outline"}
                        size="sm"
                        disabled={!user || upvoteLoading}
                        className={isReplyLiked ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-50 dark:hover:bg-red-950"}
                        title={user ? (isReplyLiked ? 'Unlike' : 'Like') : 'Login to like'}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${isReplyLiked ? 'fill-current' : ''}`} />
                        {reply.upvote_count || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No replies yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to share your thoughts on this topic!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Composer */}
      {user ? (
        <Card className="border border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Add Your Reply
            </h3>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, ask questions, or provide insights... (Ctrl+Enter to submit)"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] resize-none"
                disabled={submittingReply}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Share your experience and help the community
                </div>
                
                <Button
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim() || submittingReply}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tip: Use Ctrl+Enter to submit quickly. Be respectful and constructive.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-300 dark:border-gray-600">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Join the Discussion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign in to share your thoughts and participate in the conversation
            </p>
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950">
              Sign In to Reply
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicThreadView;