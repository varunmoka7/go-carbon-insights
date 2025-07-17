import React, { useState, useEffect } from 'react';
import { useCommunityAuth } from '@/features/forum/hooks/useCommunityAuth';
import { useCommunityCategories } from '@/features/forum/hooks/useCommunityCategories';
import { useCommunityTopics } from '@/features/forum/hooks/useCommunityTopics';
import CommunitySidebar from '@/features/forum/components/CommunitySidebar';
import CommunityFeed from '@/features/forum/components/CommunityFeed';
import CommunityThread from '@/features/forum/components/CommunityThread';
import CommunityPostComposer from '@/features/forum/components/CommunityPostComposer';
import CommunityRightbar from '@/features/forum/components/CommunityRightbar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ForumLayout from '@/features/forum/components/ForumLayout';

const Community = () => {
  const { user, loading: authLoading } = useCommunityAuth();
  const { categories, loading: categoriesLoading, selectedCategory, setSelectedCategory } = useCommunityCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const { topics, loading: topicsLoading, fetchTopics, postTopic, postReply } = useCommunityTopics(selectedCategory, searchQuery);
  const { toast } = useToast();
  const [userUpvotes, setUserUpvotes] = useState({});

  // Placeholder for trending tags and stats (replace with real data as needed)
  const trendingTags = ['climate', 'scope3', 'netzero'];
  const stats = { members: 123, threads: topics.length, replies: 456 };

  // Fetch user upvotes for topics
  useEffect(() => {
    const fetchUserUpvotes = async () => {
      if (!user) return setUserUpvotes({});
      const { data, error } = await (supabase.from('topic_upvotes') as any)
        .select('topic_id')
        .eq('user_id', user.id);
      if (error) return setUserUpvotes({});
      const upvoted = {};
      (data || []).forEach((row: any) => { upvoted[row.topic_id] = true; });
      setUserUpvotes(upvoted);
    };
    fetchUserUpvotes();
  }, [user, topics]);

  // Error handler wrapper for async actions
  const handleWithToast = async (fn, successMsg) => {
    try {
      await fn();
      if (successMsg) toast({ title: successMsg });
    } catch (error) {
      toast({ title: 'Error', description: error.message || String(error), variant: 'destructive' });
    }
  };

  // Upvote handler for topics
  const handleUpvoteTopic = async (topic) => {
    if (!user || userUpvotes[topic.id]) return;
    await handleWithToast(async () => {
      // Insert upvote record
      await (supabase.from('topic_upvotes') as any).insert({ user_id: user.id, topic_id: topic.id });
      // Increment upvote_count
      await (supabase.rpc('increment_topic_upvotes', { topic_id: topic.id }) as any);
      await fetchTopics();
    }, 'Upvoted!');
    // Optimistically update UI
    setUserUpvotes(prev => ({ ...prev, [topic.id]: true }));
  };

  // Handlers for posting
  const handlePostTopic = async ({ title, content }) => {
    await handleWithToast(() => postTopic({ title, content, author_id: user.id, category_id: selectedCategory }), 'Thread posted!');
    await fetchTopics();
  };
  const handlePostReply = async (replyContent) => {
    if (!selectedThread) return;
    await handleWithToast(() => postReply({ content: replyContent, topic_id: selectedThread.id, author_id: user.id }), 'Reply posted!');
    await fetchTopics();
  };

  // Find replies for selected thread
  const selectedThreadReplies = selectedThread ? (selectedThread.replies || []) : [];

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
          <div className="flex items-center gap-2 mb-4">
            <input
              className="flex-1 border rounded p-2"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <CommunityPostComposer onPost={handlePostTopic} user={user} loading={topicsLoading} />
          {!selectedThread ? (
            <CommunityFeed
              topics={topics}
              loading={topicsLoading}
              onSelectTopic={setSelectedThread}
              onUpvote={handleUpvoteTopic}
              userUpvotes={userUpvotes}
            />
          ) : (
            <CommunityThread
              thread={selectedThread}
              replies={selectedThreadReplies}
              user={user}
              onReply={handlePostReply}
              loading={topicsLoading}
            />
          )}
        </>
      }
      rightbar={
        <CommunityRightbar user={user} trendingTags={trendingTags} stats={stats} />
      }
    />
  );
};

export default Community;