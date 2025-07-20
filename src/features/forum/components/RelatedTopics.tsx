import React, { useState, useEffect } from 'react';
import { Link2, MessageSquare, ThumbsUp, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { searchService, TrendingTopic } from '@/api/SearchService';

interface RelatedTopicsProps {
  topicId: string;
  limit?: number;
  showHeader?: boolean;
  onTopicClick?: (topic: TrendingTopic) => void;
  className?: string;
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  topicId,
  limit = 5,
  showHeader = true,
  onTopicClick,
  className = '',
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedTopics = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error: apiError } = await searchService.getRelatedTopics(topicId, limit);
      
      if (apiError) {
        throw new Error('Failed to fetch related topics');
      }
      
      if (data) {
        setTopics(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchRelatedTopics();
    }
  }, [topicId, limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const handleRefresh = () => {
    fetchRelatedTopics();
  };

  const handleTopicClick = (topic: TrendingTopic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    } else {
      // Default behavior - navigate to topic
      window.location.href = `/forum/topics/${topic.slug || topic.id}`;
    }
  };

  if (!topicId) {
    return null;
  }

  if (error) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-red-500" />
              Related Topics
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">Failed to load related topics</div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-purple-600" />
              Related Topics
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Similar discussions you might find interesting
          </p>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? 'pt-0' : ''}>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(Math.min(limit, 3))].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-8">
            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No related topics
            </h3>
            <p className="text-gray-600 text-sm">
              We couldn't find any similar discussions
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                onClick={() => handleTopicClick(topic)}
              >
                <div className="flex items-start gap-3">
                  {/* Similarity Indicator */}
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                    <div className={`w-2 h-2 rounded-full ${getSimilarityColor(topic.trendingScore).replace('text-', 'bg-')}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm">
                      {topic.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {topic.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-3 w-3">
                          <AvatarImage src={`/api/avatars/${topic.author.username}`} />
                          <AvatarFallback className="text-[8px]">
                            {topic.author.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{topic.author.displayName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(topic.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{topic.replyCount}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{topic.upvoteCount}</span>
                        </div>
                        
                        <Badge variant="outline" className="text-[10px] px-1">
                          {topic.category.name}
                        </Badge>
                        
                        {process.env.NODE_ENV === 'development' && (
                          <Badge variant="secondary" className="text-[10px]">
                            {topic.trendingScore.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-purple-600 group-hover:text-purple-700 text-xs">
                        <span>View</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Similarity Legend */}
        {!isLoading && topics.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span>Highly similar</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Similar</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <span>Somewhat similar</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedTopics;