import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  last_reply_at?: string;
  last_reply_by?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    color?: string;
  };
  author?: {
    username: string;
    display_name?: string;
    is_gct_team?: boolean;
  };
  last_reply_by_user?: {
    username: string;
    display_name?: string;
    is_gct_team?: boolean;
  };
}

interface NewTopic {
  title: string;
  content: string;
  category_id: string;
  tags?: string[];
}

interface NewReply {
  topic_id: string;
  content: string;
  parent_reply_id?: string;
}

export function useCommunityTopics(selectedCategory?: string, searchQuery?: string) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try forum-service API first
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/forum/topics?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setTopics(data || []);
      } else {
        // Fallback to Supabase
        let query = supabase
          .from('community_topics')
          .select(`*,
            category:community_categories(name, color),
            author:community_users!community_topics_author_id_fkey(username, display_name, is_gct_team),
            last_reply_by_user:community_users!community_topics_last_reply_by_fkey(username, display_name, is_gct_team)
          `)
          .order('is_pinned', { ascending: false })
          .order('last_reply_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });
          
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        let filtered = data || [];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            t => t.title.toLowerCase().includes(q) ||
                 t.content.toLowerCase().includes(q) ||
                 (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
          );
        }
        setTopics(filtered);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topics');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const createTopic = async (topicData: NewTopic) => {
    if (!user) {
      throw new Error('Must be logged in to create topics');
    }

    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...topicData,
          author_id: user.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create topic');
      }
      
      await fetchTopics();
      return await response.json();
    } catch (err) {
      console.error('Error creating topic:', err);
      throw err;
    }
  };

  const createReply = async (replyData: NewReply) => {
    if (!user) {
      throw new Error('Must be logged in to reply');
    }

    try {
      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...replyData,
          author_id: user.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create reply');
      }
      
      await fetchTopics();
      return await response.json();
    } catch (err) {
      console.error('Error creating reply:', err);
      throw err;
    }
  };

  return {
    topics,
    loading,
    error,
    fetchTopics,
    createTopic,
    createReply,
  };
} 