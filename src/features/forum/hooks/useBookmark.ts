import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

export function useBookmark(topicId: string) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    if (!user) {
      setIsBookmarked(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }
      setIsBookmarked(!!data);
    } catch (err) {
      console.error('Error checking bookmark status:', err);
      toast.error('Failed to check bookmark status.');
    } finally {
      setLoading(false);
    }
  }, [user, topicId]);

  useEffect(() => {
    checkBookmarkStatus();
  }, [checkBookmarkStatus]);

  const toggleBookmark = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to bookmark a topic.');
      return;
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId);

        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Bookmark removed!');
      } else {
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({ user_id: user.id, topic_id: topicId });

        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Topic bookmarked!');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to toggle bookmark.');
    } finally {
      setLoading(false);
    }
  }, [user, topicId, isBookmarked]);

  return {
    isBookmarked,
    toggleBookmark,
    loading,
  };
}
