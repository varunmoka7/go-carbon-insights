import React from 'react';
import { Clock, MessageSquare, ThumbsUp, User, FileText, MessageCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchResult, SearchResponse } from '@/api/SearchService';

interface SearchResultsProps {
  searchResponse: SearchResponse | null;
  isLoading: boolean;
  query: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResponse,
  isLoading,
  query,
  onLoadMore,
  hasMore,
  onResultClick,
}) => {
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

  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 font-medium px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderSearchResult = (result: SearchResult, index: number) => {
    const isReply = result.type === 'reply';
    
    return (
      <Card
        key={`${result.type}-${result.id}`}
        className="hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => onResultClick?.(result)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Author Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={`/api/avatars/${result.author.username}`} />
              <AvatarFallback className="text-xs">
                {result.author.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {isReply ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span className="font-medium">{result.author.displayName}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(result.createdAt)}</span>
                  {result.category && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {result.category.name}
                      </Badge>
                    </>
                  )}
                </div>
                
                {/* Relevance Score (for debugging) */}
                {process.env.NODE_ENV === 'development' && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {result.relevanceScore.toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Title (for topics) */}
              {result.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {result.highlighted?.title ? (
                    <span dangerouslySetInnerHTML={{ __html: result.highlighted.title }} />
                  ) : (
                    highlightText(result.title, query)
                  )}
                </h3>
              )}

              {/* Content Excerpt */}
              <div className="text-gray-700 mb-3 leading-relaxed">
                {result.highlighted?.content ? (
                  <span dangerouslySetInnerHTML={{ __html: result.highlighted.content }} />
                ) : (
                  <span>{highlightText(result.excerpt, query)}</span>
                )}
              </div>

              {/* Tags */}
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {result.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle tag click
                      }}
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {result.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{result.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Footer with engagement metrics */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {!isReply && (
                    <>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>0 replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>0 upvotes</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
                  <span className="text-xs">View {isReply ? 'reply' : 'topic'}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading && !searchResponse) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!searchResponse || !query) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Start your search
        </h3>
        <p className="text-gray-600">
          Enter a query to search through topics and replies
        </p>
      </div>
    );
  }

  if (searchResponse.results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any topics or replies matching "{query}"
        </p>
        
        {/* Search suggestions */}
        {searchResponse.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Try these suggestions:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchResponse.suggestions.map((suggestion, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    // This assumes onResultClick can handle a suggestion string
                    // You might need a separate prop for handling suggestion clicks
                    onResultClick?.({ ...searchResponse.results[0], title: suggestion, content: suggestion });
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Found {searchResponse.totalCount.toLocaleString()} result{searchResponse.totalCount !== 1 ? 's' : ''} 
            {query && ` for "${query}"`}
            <span className="text-gray-400 ml-2">
              ({searchResponse.searchTime}ms)
            </span>
          </p>
        </div>
        
        {/* Result type indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Topics</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Replies</span>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {searchResponse.results.map((result, index) => renderSearchResult(result, index))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                Loading more...
              </>
            ) : (
              'Load more results'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;