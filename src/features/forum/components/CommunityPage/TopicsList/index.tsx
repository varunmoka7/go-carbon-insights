import React, { useState, useMemo } from 'react';
import { Pin, Search, ArrowUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TopicCard from './TopicCard';
import NewTopicForm from '../../NewTopicForm';
import { useCommunityTopics } from '../../../hooks/useCommunityTopics';
import { useCommunityCategories } from '../../../hooks/useCommunityCategories';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { useAuth } from '@/contexts/AuthContext';

interface TopicsListProps {
  selectedCategory?: string;
  onTopicSelect?: (topicId: string) => void;
}

const sortOptions = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '🆕 New', value: 'new' },
  { label: '📊 Top', value: 'top' },
  { label: '💬 Active', value: 'active' },
];

const TopicsList: React.FC<TopicsListProps> = ({ selectedCategory, onTopicSelect }) => {
  const [sort, setSort] = useState<'hot' | 'new' | 'top' | 'active'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  
  const { user } = useAuth();
  const { categories } = useCommunityCategories();
  const { 
    topics, 
    loading, 
    loadingMore,
    error, 
    paginationError,
    hasMoreData,
    loadMoreTopics
  } = useCommunityTopics(selectedCategory, searchQuery, { sort, limit: 20 });

  const { sentinelRef, showBackToTop, scrollToTop } = useInfiniteScroll({
    onLoadMore: loadMoreTopics,
    hasMore: hasMoreData,
    loading: loadingMore,
    threshold: 300,
  });

  const handleNewTopic = () => {
    setShowNewTopicForm(true);
  };

  const handleTopicClick = (id: string) => {
    onTopicSelect?.(id);
  };

  const handleNewTopicSuccess = (topicId: string) => {
    handleTopicClick(topicId);
  };

  const handleRetryLoadMore = () => {
    loadMoreTopics();
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : null;

  // Separate pinned and regular topics (server-side sorting is already applied)
  const { pinnedTopics, regularTopics } = useMemo(() => {
    const pinned = topics.filter(t => t.is_pinned);
    const regular = topics.filter(t => !t.is_pinned);
    return { pinnedTopics: pinned, regularTopics: regular };
  }, [topics]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {selectedCategoryName ? `${selectedCategoryName} Discussions` : 'Community Discussions'}
          </h2>
          <Button
            onClick={handleNewTopic}
            disabled
            className="bg-teal-600 hover:bg-teal-700"
          >
            + New Topic
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">Error loading topics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header and New Topic Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {selectedCategoryName ? `${selectedCategoryName} Discussions` : 'Community Discussions'}
        </h2>
        <Button
          onClick={handleNewTopic}
          disabled={!user}
          className="bg-teal-600 hover:bg-teal-700"
          title={!user ? 'Login required to create topics' : 'Create a new topic'}
        >
          + New Topic
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-6">
        {sortOptions.map(opt => (
          <Button
            key={opt.value}
            variant={sort === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSort(opt.value as any)}
            className={sort === opt.value ? "bg-teal-600 hover:bg-teal-700" : ""}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* No Topics Message */}
      {topics.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
            {searchQuery 
              ? `No topics found matching "${searchQuery}"` 
              : selectedCategoryName 
                ? `No topics in ${selectedCategoryName} yet` 
                : 'No topics yet'
            }
          </p>
          {user && (
            <Button
              onClick={handleNewTopic}
              variant="outline"
              className="text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
            >
              Be the first to start a discussion!
            </Button>
          )}
        </div>
      )}

      {/* Pinned Topics */}
      {pinnedTopics.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-teal-600 dark:text-teal-400 font-semibold text-sm">
            <Pin className="w-4 h-4" /> Pinned
          </div>
          <div className="space-y-3">
            {pinnedTopics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Topics */}
      {regularTopics.length > 0 && (
        <div className="space-y-3">
          {regularTopics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => handleTopicClick(topic.id)}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading More Indicator */}
      {loadingMore && !paginationError && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading more topics...</span>
        </div>
      )}

      {/* Pagination Error with Retry */}
      {paginationError && (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 max-w-md w-full">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Failed to load more topics
              </h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              {paginationError}
            </p>
            <Button
              onClick={handleRetryLoadMore}
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* End of Topics Message */}
      {!hasMoreData && topics.length > 0 && !paginationError && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">You've reached the end of the topics!</p>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 bg-teal-600 hover:bg-teal-700 shadow-lg"
          size="icon"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* New Topic Form Modal */}
      <NewTopicForm
        isOpen={showNewTopicForm}
        onClose={() => setShowNewTopicForm(false)}
        initialCategoryId={selectedCategory}
        onSuccess={handleNewTopicSuccess}
      />
    </div>
  );
};

export default TopicsList; 