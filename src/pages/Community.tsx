import React, { useState, useRef, useEffect } from 'react';
import CommunityLayout from '@/components/CommunityLayout';
import Sidebar from '@/features/forum/components/CommunityPage/Sidebar';
import CommunityFeed from '@/features/forum/components/CommunityFeed';
import { useInfiniteTopics } from '@/features/forum/hooks/useInfiniteTopics';
import { useUpvote } from '@/features/forum/hooks/useUpvote';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import NewTopicForm from '@/features/forum/components/NewTopicForm';

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { topics, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteTopics(selectedCategory);
  const { user, loading: authLoading } = useAuth();
  const { handleTopicUpvote, isTopicUpvoted } = useUpvote();
  const navigate = useNavigate();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isNewTopicFormOpen, setIsNewTopicFormOpen] = useState(false);

  // Add debugging information
  useEffect(() => {
    console.log('Community component mounted');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Topics loading:', isLoading);
    console.log('Topics error:', error);
  }, [authLoading, user, isLoading, error]);

  useKeyboardShortcuts([
    { key: 'n', handler: () => setIsNewTopicFormOpen(true) },
    { key: '/', handler: () => navigate('/search') },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTopicSelect = (topicId: string) => {
    navigate(`/community/topics/${topicId}`);
  };

  const handleUpvote = async (topic: any) => {
    if (!user) {
      // Optionally, show a toast or modal asking user to log in
      alert('Please log in to upvote topics.');
      return;
    }
    await handleTopicUpvote(topic.id, topic.upvote_count);
  };

  const userUpvotes = topics.reduce((acc, topic) => {
    acc[topic.id] = isTopicUpvoted(topic.id);
    return acc;
  }, {} as Record<string, boolean>);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading community...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Error Loading Community
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CommunityLayout
      sidebar={
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onTopicSelect={handleTopicSelect}
        />
      }
    >
      <div className="flex-1 p-4">
        <CommunityFeed 
          topics={topics}
          loading={isLoading && topics.length === 0}
          onSelectTopic={handleTopicSelect}
          onUpvote={handleUpvote}
          userUpvotes={userUpvotes}
        />
        {(isFetchingNextPage || (isLoading && topics.length > 0)) && (
          <div className="flex justify-center py-4">
            <Spinner size="lg" />
          </div>
        )}
        {!isLoading && !isFetchingNextPage && !hasNextPage && topics.length > 0 && (
          <div className="text-center text-gray-500 py-4">You've reached the end of the topics.</div>
        )}
        {!isLoading && topics.length === 0 && !error && (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 mt-8">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No topics found in this category
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to create a topic in this category!
              </p>
            </CardContent>
          </Card>
        )}
        <div ref={loadMoreRef} style={{ height: '20px' }} />
      </div>
      <NewTopicForm
        isOpen={isNewTopicFormOpen}
        onClose={() => setIsNewTopicFormOpen(false)}
        initialCategoryId={selectedCategory}
      />
    </CommunityLayout>
  );
};

export default Community;