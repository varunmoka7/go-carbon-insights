import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, ThumbsUp, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { searchService, TrendingTopic } from '@/api/SearchService';

interface TrendingTopicsProps {
  limit?: number;
  showHeader?: boolean;
  onTopicClick?: (topic: TrendingTopic) => void;
  className?: string;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  limit = 10,
  showHeader = true,
  onTopicClick,
  className = '',
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchTrendingTopics = async () => {
    try {
      setError(null);
      const { data, error: apiError } = await searchService.getTrendingTopics(limit);
      
      if (apiError) {
        throw new Error('Failed to fetch trending topics');
      }
      
      if (data) {
        setTopics(data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, [limit]);

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

  const getTrendingBadgeColor = (score: number) => {
    if (score >= 50) return 'bg-red-500';
    if (score >= 30) return 'bg-orange-500';
    if (score >= 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchTrendingTopics();
  };

  const handleTopicClick = (topic: TrendingTopic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    } else {
      // Default behavior - navigate to topic
      window.location.href = `/forum/topics/${topic.slug || topic.id}`;
    }
  };

  if (error) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Trending Topics
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">Failed to load trending topics</div>
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
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Trending Topics
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
            Most active discussions right now
          </p>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? 'pt-0' : ''}>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(Math.min(limit, 5))].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trending topics
            </h3>
            <p className="text-gray-600 text-sm">
              Check back later for trending discussions
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
                  {/* Trending Rank */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="relative">
                      <div className={`w-6 h-6 ${getTrendingBadgeColor(topic.trendingScore)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1">
                          <TrendingUp className="h-3 w-3 text-orange-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {topic.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={`/api/avatars/${topic.author.username}`} />
                          <AvatarFallback className="text-[10px]">
                            {topic.author.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{topic.author.display_name || topic.author.username}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(topic.createdAt)}</span>
                      </div>
                      
                      <Badge variant="outline" className="text-[10px] px-1">
                        {topic.category.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{topic.replyCount}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{topic.upvoteCount}</span>
                        </div>
                        
                        {process.env.NODE_ENV === 'development' && (
                          <Badge variant="secondary" className="text-[10px]">
                            {topic.trendingScore.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 text-xs">
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
        
        {/* Last Updated */}
        {!isLoading && topics.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Updated {formatDate(lastRefresh.toISOString())}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;