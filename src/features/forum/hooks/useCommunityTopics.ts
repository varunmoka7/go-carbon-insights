import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityTopics(selectedCategory, searchQuery) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_topics')
        .select(`*,
          category:community_categories(name, color),
          author:community_users!community_topics_author_id_fkey(username, display_name, is_gct_team),
          last_reply_by:community_users!community_topics_last_reply_by_fkey(username, display_name, is_gct_team)
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
               (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
        );
      }
      setTopics(filtered);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const postTopic = async (topic) => {
    const { error } = await supabase.from('community_topics').insert(topic);
    if (error) throw error;
    await fetchTopics();
  };

  const postReply = async (reply) => {
    const { error } = await supabase.from('community_replies').insert(reply);
    if (error) throw error;
    await fetchTopics();
  };

  return { topics, loading, fetchTopics, postTopic, postReply };
} 