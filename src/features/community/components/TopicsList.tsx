import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  ThumbsUp, 
  Eye, 
  Pin, 
  Lock, 
  Plus,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingFallback from '@/components/LoadingFallback';
import type { Topic } from '../types';

interface TopicsListProps {
  categoryId?: string;
}

export const TopicsList: React.FC<TopicsListProps> = ({ categoryId }) => {
  const { 
    data: topics = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['topics', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('community_topics')
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url),
          category:community_categories(id, name, slug)
        `)
        .eq('is_hidden', false)
        .is('deleted_at', null) // Exclude deleted topics
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Topic[];
    }
  });

  if (isLoading) {
    return <LoadingFallback message="Loading topics..." />;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load topics: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with New Topic Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Topic
        </Button>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">
              No topics found. Be the first to start a discussion!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Topic Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badges */}
            <div className="flex items-center gap-2 mb-2">
              {topic.is_pinned && (
                <Pin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
              {topic.is_locked && (
                <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
              )}
              {topic.category && (
                <Badge variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {topic.category.name}
                </Badge>
              )}
            </div>

            {/* Topic Title */}
            <Link 
              to={`/community/topic/${topic.id}`}
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {topic.title}
              </h3>
            </Link>

            {/* Topic Preview */}
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {topic.content.substring(0, 150)}
              {topic.content.length > 150 && '...'}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{topic.author?.username || 'Unknown User'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={topic.created_at}>
                  {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                </time>
              </div>

              {topic.updated_at !== topic.created_at && (
                <span className="text-xs text-blue-600">
                  edited {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true })}
                </span>
              )}
            </div>

            {/* Tags */}
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {topic.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {topic.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{topic.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center gap-2 text-sm text-gray-500 min-w-0">
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
      </CardContent>
    </Card>
  );
};