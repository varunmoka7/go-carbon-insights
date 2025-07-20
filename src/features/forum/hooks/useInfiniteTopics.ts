import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  upvote_count: number;
  created_at: string;
  last_reply_at: string | null;
  author: {
    display_name: string;
    username: string;
    avatar_url: string;
  };
  category: {
    name: string;
    color: string;
  };
}

interface UseInfiniteTopicsResult {
  topics: Topic[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: string | null;
}

const PAGE_SIZE = 10;

export function useInfiniteTopics(categoryId?: string): UseInfiniteTopicsResult {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async (pageToFetch: number) => {
    if (!hasNextPage && pageToFetch > 0) return; // Prevent fetching if no more pages

    if (pageToFetch === 0) {
      setIsLoading(true);
    } else {
      setIsFetchingNextPage(true);
    }
    setError(null);

    try {
      let query = supabase
        .from('community_topics')
        .select(
          `
          *,
          author:community_users(display_name, username, avatar_url),
          category:community_categories(name, color)
          `
        )
        .order('is_pinned', { ascending: false })
        .order('last_reply_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: fetchError } = await query.range(
        pageToFetch * PAGE_SIZE,
        (pageToFetch + 1) * PAGE_SIZE - 1
      );

      if (fetchError) throw fetchError;

      if (pageToFetch === 0) {
        setTopics(data || []);
      } else {
        setTopics(prevTopics => [...prevTopics, ...(data || [])]);
      }

      setHasNextPage((data?.length || 0) === PAGE_SIZE);
      setPage(pageToFetch);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [categoryId, hasNextPage]);

  useEffect(() => {
    setTopics([]); // Clear topics when category changes
    setPage(0);
    setHasNextPage(true);
    fetchTopics(0);
  }, [categoryId, fetchTopics]);

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchTopics(page + 1);
    }
  }, [hasNextPage, isFetchingNextPage, page, fetchTopics]);

  return {
    topics,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  };
}
