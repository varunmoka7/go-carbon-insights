import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquare, Eye, Clock, Pin, Paperclip, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTopicThread } from '../hooks/useTopicThread';
import { useUpvote } from '../hooks/useUpvote';
import { useBookmark } from '../hooks/useBookmark';
import { useUserPresence } from '../hooks/useUserPresence';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DOMPurify from 'dompurify';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Spinner } from '@/components/ui/spinner';

interface TopicThreadViewProps {
  onBackToTopics: () => void;
}

const TopicThreadView: React.FC<TopicThreadViewProps> = ({ onBackToTopics }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { presence, fetchPresence } = useUserPresence();
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(topicId!);
  const { 
    topic, 
    replies, 
    loading, 
    repliesLoading, 
    error, 
    submittingReply,
    createReply,
    refetchTopic,
    refetchReplies,
    fetchNextRepliesPage,
    hasMoreReplies
  } = useTopicThread(topicId!);
  
  const { 
    isTopicUpvoted, 
    isReplyUpvoted, 
    handleTopicUpvote, 
    handleReplyUpvote,
    isLoading: upvoteLoading 
  } = useUpvote();

  const [replyContent, setReplyContent] = React.useState('');
  const loadMoreRepliesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreReplies && !repliesLoading) {
          fetchNextRepliesPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRepliesRef.current) {
      observer.observe(loadMoreRepliesRef.current);
    }

    return () => {
      if (loadMoreRepliesRef.current) {
        observer.unobserve(loadMoreRepliesRef.current);
      }
    };
  }, [fetchNextRepliesPage, hasMoreReplies, repliesLoading]);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleLikeTopic = async () => {
    if (!user || !topic) return;
    
    try {
      await handleTopicUpvote(topic.id, topic.upvote_count);
      refetchTopic();
    } catch (error) {
      console.error('Failed to like topic:', error);
    }
  };

  const handleLikeReply = async (replyId: string, upvoteCount: number) => {
    if (!user) return;
    
    try {
      await handleReplyUpvote(replyId, upvoteCount);
      refetchReplies();
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

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/community', label: 'Community' },
    { href: `/community/categories/${topic.category.id}`, label: topic.category.name },
    { href: `/community/topics/${topic.id}`, label: topic.title },
  ];

  useEffect(() => {
    if (topic?.author_id) {
      fetchPresence([topic.author_id]);
    }
  }, [topic?.author_id, fetchPresence]);

  useEffect(() => {
    if (replies.length > 0) {
      const replyAuthorIds = replies.map(reply => reply.author_id);
      fetchPresence(replyAuthorIds);
    }
  }, [replies, fetchPresence]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Breadcrumb items={breadcrumbItems} />

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
              {presence[topic.author_id] && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500" title="Online"></span>
              )}
              {topic.author?.is_gct_team && (
                <Badge variant="outline" className="ml-2 text-xs border-emerald-500 text-emerald-600">
                  Team
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-gray dark:prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(topic.content) }}
          />

          {topic.attachments && topic.attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-4">
                {topic.attachments.map((attachment: any, index: number) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

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

            <Button
              onClick={toggleBookmark}
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              disabled={!user || bookmarkLoading}
              className={isBookmarked ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 dark:hover:bg-blue-950"}
              title={user ? (isBookmarked ? 'Remove bookmark' : 'Bookmark topic') : 'Login to bookmark'}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              Bookmark
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Replies ({replies.length})
        </h2>
        
        {repliesLoading && replies.length === 0 ? (
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
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.author?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                          {getInitials(replyAuthorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {replyAuthorName}
                        </span>
                        {presence[reply.author_id] && (
                          <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-500" title="Online"></span>
                        )}
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
                    <div 
                      className="mb-3"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }}
                    />

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
        {(repliesLoading && replies.length > 0) && (
          <div className="flex justify-center py-4">
            <Spinner size="lg" />
          </div>
        )}
        {!repliesLoading && !hasMoreReplies && replies.length > 0 && (
          <div className="text-center text-gray-500 py-4">You've reached the end of the replies.</div>
        )}
        <div ref={loadMoreRepliesRef} style={{ height: '20px' }} />
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
              <RichTextEditor
                content={replyContent}
                onChange={(html) => {
                  setReplyContent(html);
                  startTyping();
                }}
                onBlur={stopTyping}
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
              {typingUsers.length > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  {typingUsers.map(username => `@${username}`).join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                </div>
              )}
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
            <Button 
              variant="outline" 
              className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
              onClick={() => navigate('/auth')}
            >
              Sign In to Reply
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicThreadView;