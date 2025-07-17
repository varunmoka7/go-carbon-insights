import React, { useState } from 'react';
import { useCommunityAuth } from '@/features/forum/hooks/useCommunityAuth';
import { useCommunityCategories } from '@/features/forum/hooks/useCommunityCategories';
import { useCommunityTopics } from '@/features/forum/hooks/useCommunityTopics';
import CommunitySidebar from '@/features/forum/components/CommunitySidebar';
import TopicsList from '@/features/forum/components/TopicsList';
import ForumLayout from '@/features/forum/components/ForumLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const { user, loading: authLoading } = useCommunityAuth();
  const { categories, loading: categoriesLoading, selectedCategory, setSelectedCategory } = useCommunityCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const { topics, loading: topicsLoading } = useCommunityTopics(selectedCategory, searchQuery);
  const navigate = useNavigate();

  // Placeholder trending tags and stats
  const trendingTags = ['climate', 'scope3', 'netzero'];
  const stats = { members: 123, threads: topics.length, replies: 456 };

  if (authLoading || categoriesLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading community...</div>;
  }

  return (
    <ForumLayout
      sidebar={
        <CommunitySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          tags={trendingTags}
          quickLinks={[]}
        />
      }
      main={
        <div className="w-full">
          {/* Main content area now takes full width */}
          <TopicsList topics={topics} onTopicSelect={() => {}} />
        </div>
      }
      // Remove rightbar prop
    />
  );
};

export default Community;