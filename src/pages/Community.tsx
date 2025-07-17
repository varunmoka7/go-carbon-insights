import React, { useState } from 'react';
import { useCommunityAuth } from '@/features/forum/hooks/useCommunityAuth';
import { useCommunityCategories } from '@/features/forum/hooks/useCommunityCategories';
import { useCommunityTopics } from '@/features/forum/hooks/useCommunityTopics';
import CommunitySidebar from '@/features/forum/components/CommunitySidebar';
import TopicsList from '@/features/forum/components/TopicsList';
import CommunityRightbar from '@/features/forum/components/CommunityRightbar';
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
        <>
          {/* Professional Header and Back Button */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-emerald-700 font-montserrat">GoCarbonTracker Community</h1>
              <Button variant="outline" onClick={() => navigate('/')}>← Back to Home</Button>
            </div>
            <div className="text-gray-600 text-sm mb-2">Global hub for carbon tracking professionals</div>
          </div>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              className="w-full border rounded p-2"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Knowledge Base Content Grid */}
          <TopicsList topics={topics} onTopicSelect={() => {}} />
        </>
      }
      rightbar={
        <CommunityRightbar user={user} trendingTags={trendingTags} stats={stats} />
      }
    />
  );
};

export default Community;