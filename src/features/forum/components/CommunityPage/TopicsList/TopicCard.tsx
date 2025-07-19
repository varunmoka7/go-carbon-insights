import React from 'react';
import { MessageSquare, Eye, Pin, Clock, User, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useUpvote } from '../../../hooks/useUpvote';
import { useAuth } from '@/contexts/AuthContext';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    content?: string;
    is_pinned?: boolean;
    is_locked?: boolean;
    reply_count?: number;
    view_count?: number;
    upvote_count?: number;
    created_at: string;
    last_reply_at?: string;
    tags?: string[];
    category?: {
      name: string;
      color?: string;
    };
    author?: {
      username: string;
      display_name?: string;
      is_gct_team?: boolean;
    };
    last_reply_by_user?: {
      username: string;
      display_name?: string;
      is_gct_team?: boolean;
    };
  };
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const { user } = useAuth();
  const { handleTopicUpvote, isTopicUpvoted, isLoading } = useUpvote();
  
  const authorName = topic.author?.display_name || topic.author?.username || 'Unknown';
  const lastReplyBy = topic.last_reply_by_user?.display_name || topic.last_reply_by_user?.username;
  const categoryColor = topic.category?.color || '#6366f1';
  
  const isUpvoted = isTopicUpvoted(topic.id);
  const upvoteCount = topic.upvote_count || 0;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPreview = (content: string | undefined) => {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  const timeAgo = topic.last_reply_at 
    ? formatDistanceToNow(new Date(topic.last_reply_at), { addSuffix: true })
    : formatDistanceToNow(new Date(topic.created_at), { addSuffix: true });

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Could show a login prompt here
      return;
    }
    
    try {
      await handleTopicUpvote(topic.id, upvoteCount);
    } catch (error) {
      console.error('Failed to upvote topic:', error);
    }
  };

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg bg-[#232323] border border-[#333] shadow hover:bg-[#262626] transition cursor-pointer focus-within:ring-2 focus-within:ring-emerald-400 group"
      tabIndex={0}
      role="button"
      aria-label={`Open topic: ${topic.title}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header with category and metadata */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {topic.category && (
            <>
              <span 
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: categoryColor }}
              />
              <span className="text-xs font-semibold text-gray-300">
                {topic.category.name}
              </span>
            </>
          )}
          
          {topic.is_pinned && (
            <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
              <Pin className="w-3 h-3 mr-1" />
              Pinned
            </Badge>
          )}
          
          {topic.is_locked && (
            <Badge variant="destructive" className="text-xs">
              Locked
            </Badge>
          )}
          
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {topic.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
            {getInitials(authorName)}
          </div>
          <span className="text-xs text-gray-300">{authorName}</span>
          {topic.author?.is_gct_team && (
            <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400">
              Team
            </Badge>
          )}
        </div>

        {/* Content Preview */}
        {topic.content && (
          <div className="text-gray-400 text-sm line-clamp-2 mb-3">
            {getPreview(topic.content)}
          </div>
        )}

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {topic.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-[#181818] border-emerald-700 text-emerald-300 hover:bg-emerald-900 hover:text-white transition cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
            {topic.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-400">
                +{topic.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Last reply info */}
        {lastReplyBy && topic.last_reply_at && (
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Last reply by {lastReplyBy}</span>
          </div>
        )}
      </div>

      {/* Stats and Actions */}
      <div className="flex flex-col items-end min-w-[90px] gap-2 mt-1">
        {/* Upvote Button */}
        <Button
          onClick={handleUpvote}
          variant="ghost"
          size="sm"
          className={`h-8 px-2 ${
            isUpvoted 
              ? 'text-blue-400 bg-blue-400/10 hover:bg-blue-400/20' 
              : 'text-gray-400 hover:text-blue-400 hover:bg-blue-400/10'
          } transition-colors`}
          disabled={isLoading || !user}
          title={user ? (isUpvoted ? 'Remove upvote' : 'Upvote topic') : 'Login to upvote'}
        >
          <ChevronUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
          <span className="ml-1 font-semibold">{upvoteCount}</span>
        </Button>
        
        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>{topic.reply_count || 0}</span>
        </span>
        <span className="flex items-center gap-1 text-gray-400 font-semibold text-sm">
          <Eye className="w-4 h-4" />
          <span>{topic.view_count || 0}</span>
        </span>
      </div>
    </div>
  );
};

export default TopicCard; 