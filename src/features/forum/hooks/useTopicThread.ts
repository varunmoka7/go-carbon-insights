import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TopicAuthor {
  username: string;
  display_name?: string;
  is_gct_team?: boolean;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  category_id: string;
  author_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  view_count: number;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    color?: string;
  };
  author?: TopicAuthor;
}

interface Reply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  author?: TopicAuthor;
}

interface CreateReplyData {
  content: string;
}

export function useTopicThread(topicId: string | null) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const { user } = useAuth();

  const fetchTopic = useCallback(async () => {
    if (!topicId) {
      setTopic(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try forum-service API first
      const response = await fetch(`/api/forum/topics/${topicId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTopic(data);
      } else {
        // Fallback to direct Supabase query
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase
          .from('community_topics')
          .select(`
            *,
            category:community_categories(name, color),
            author:community_users!community_topics_author_id_fkey(username, display_name, is_gct_team)
          `)
          .eq('id', topicId)
          .single();

        if (error) throw error;
        setTopic(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topic');
      console.error('Error fetching topic:', err);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const fetchReplies = useCallback(async () => {
    if (!topicId) {
      setReplies([]);
      setRepliesLoading(false);
      return;
    }

    setRepliesLoading(true);

    try {
      // Try forum-service API first
      const response = await fetch(`/api/forum/topics/${topicId}/replies`);
      
      if (response.ok) {
        const data = await response.json();
        setReplies(data || []);
      } else {
        // Fallback to direct Supabase query
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase
          .from('community_replies')
          .select(`
            *,
            author:community_users!community_replies_author_id_fkey(username, display_name, is_gct_team)
          `)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setReplies(data || []);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
      // Don't set error for replies - just log it
    } finally {
      setRepliesLoading(false);
    }
  }, [topicId]);

  const createReply = useCallback(async (replyData: CreateReplyData) => {
    if (!user || !topicId) {
      throw new Error('Authentication required to post replies');
    }

    setSubmittingReply(true);

    try {
      // Try forum-service API first
      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topic_id: topicId,
          content: replyData.content,
          author_id: user.id,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        // Refresh replies to get the new one
        await fetchReplies();
        // Also refresh topic to update reply count
        await fetchTopic();
        return newReply;
      } else {
        // Fallback to direct Supabase insert
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase
          .from('community_replies')
          .insert({
            topic_id: topicId,
            content: replyData.content,
            author_id: user.id,
          })
          .select(`
            *,
            author:community_users!community_replies_author_id_fkey(username, display_name, is_gct_team)
          `)
          .single();

        if (error) throw error;

        // Update local state
        setReplies(prev => [...prev, data]);
        
        // Update topic reply count
        if (topic) {
          setTopic(prev => prev ? { ...prev, reply_count: prev.reply_count + 1 } : null);
        }

        return data;
      }
    } catch (err) {
      console.error('Error creating reply:', err);
      throw err instanceof Error ? err : new Error('Failed to create reply');
    } finally {
      setSubmittingReply(false);
    }
  }, [user, topicId, fetchReplies, fetchTopic, topic]);

  const incrementViewCount = useCallback(async () => {
    if (!topicId || !user) return;

    try {
      // Try to increment view count via API
      await fetch(`/api/forum/topics/${topicId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
    } catch (err) {
      // Silently fail - view count is not critical
      console.log('Failed to increment view count:', err);
    }
  }, [topicId, user]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  // Increment view count when topic is loaded
  useEffect(() => {
    if (topic && !loading) {
      incrementViewCount();
    }
  }, [topic, loading, incrementViewCount]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchTopic(), fetchReplies()]);
  }, [fetchTopic, fetchReplies]);

  // Real-time subscription for new replies
  useEffect(() => {
    if (!topicId) return;

    const subscription = supabase
      .channel(`topic_replies:${topicId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_replies',
          filter: `topic_id=eq.${topicId}`,
        },
        (payload) => {
          const newReply = payload.new as Reply;
          setReplies((prev) => [...prev, newReply]);

          // Notify topic author if it's not their own reply
          if (topic && user && newReply.author_id !== user.id && newReply.author_id === topic.author_id) {
            toast.success(`New reply in your topic: "${topic.title}"`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [topicId, topic, user]);

  const fetchNextRepliesPage = useCallback(() => {
    if (hasMoreReplies && !repliesLoading) {
      fetchReplies(replyPage + 1, true);
    }
  }, [hasMoreReplies, repliesLoading, replyPage, fetchReplies]);

  return {
    topic,
    replies,
    loading,
    repliesLoading,
    error,
    submittingReply,
    createReply,
    refresh,
    refetchTopic: fetchTopic, // Expose refetch functions for manual refresh
    refetchReplies: fetchReplies,
    fetchNextRepliesPage,
    hasMoreReplies,
  };
}