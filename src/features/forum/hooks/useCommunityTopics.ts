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

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: 'hot' | 'new' | 'top' | 'active';
}

export function useCommunityTopics(
  selectedCategory?: string, 
  searchQuery?: string,
  paginationOptions?: PaginationOptions
) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const { page = 1, limit = 20, sort = 'new' } = paginationOptions || {};

  const fetchTopics = useCallback(async (isLoadingMore = false) => {
    if (isLoadingMore) {
      setLoadingMore(true);
      setPaginationError(null); // Clear pagination error on retry
    } else {
      setLoading(true);
      setTopics([]); // Reset topics for fresh load
      setCurrentPage(1);
      setHasMoreData(true);
      setError(null);
      setPaginationError(null);
    }

    const pageToFetch = isLoadingMore ? currentPage + 1 : 1;

    try {
      // Try forum-service API first
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', pageToFetch.toString());
      params.append('limit', limit.toString());
      params.append('sort', sort);
      
      const response = await fetch(`/api/forum/topics?${params}`);
      
      if (response.ok) {
        const result = await response.json();
        const newTopics = result.data || result || [];
        
        // More robust hasMore logic - prioritize API response
        let hasMore: boolean;
        if (result.hasMore !== undefined) {
          hasMore = result.hasMore; // Use API response if available
        } else if (result.totalCount !== undefined) {
          // Use total count if available
          const totalFetched = isLoadingMore ? topics.length + newTopics.length : newTopics.length;
          hasMore = totalFetched < result.totalCount;
        } else {
          // Fallback: assume more data if we got a full page
          hasMore = newTopics.length >= limit;
        }
        
        if (isLoadingMore) {
          setTopics(prev => [...prev, ...newTopics]);
          setCurrentPage(pageToFetch);
        } else {
          setTopics(newTopics);
          setCurrentPage(1);
        }
        setHasMoreData(hasMore);
      } else {
        // Fallback to Supabase with pagination
        const offset = (pageToFetch - 1) * limit;
        
        let query = supabase
          .from('community_topics')
          .select(`*,
            category:community_categories(name, color),
            author:community_users!community_topics_author_id_fkey(username, display_name, is_gct_team),
            last_reply_by_user:community_users!community_topics_last_reply_by_fkey(username, display_name, is_gct_team)
          `, { count: 'exact' })
          .range(offset, offset + limit - 1);

        // Apply sorting
        switch (sort) {
          case 'new':
            query = query.order('created_at', { ascending: false });
            break;
          case 'top':
            query = query.order('view_count', { ascending: false, nullsFirst: false });
            break;
          case 'active':
            query = query.order('last_reply_at', { ascending: false, nullsFirst: false })
                         .order('created_at', { ascending: false });
            break;
          case 'hot':
          default:
            // Hot = combination of replies and views, calculated client-side for now
            query = query.order('reply_count', { ascending: false, nullsFirst: false })
                         .order('view_count', { ascending: false, nullsFirst: false });
            break;
        }

        // Always prioritize pinned topics
        query = query.order('is_pinned', { ascending: false });
          
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        const { data, error, count } = await query;
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

        // Improved hasMore logic for Supabase fallback
        let hasMore: boolean;
        if (count !== null) {
          // Use total count for accurate pagination
          const totalFetched = isLoadingMore ? topics.length + filtered.length : filtered.length;
          hasMore = totalFetched < count;
        } else {
          // Fallback: assume more data if we got a full page
          hasMore = filtered.length >= limit;
        }
        
        if (isLoadingMore) {
          setTopics(prev => [...prev, ...filtered]);
          setCurrentPage(pageToFetch);
        } else {
          setTopics(filtered);
          setCurrentPage(1);
        }
        setHasMoreData(hasMore);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch topics';
      if (isLoadingMore) {
        setPaginationError(errorMessage);
      } else {
        setError(errorMessage);
      }
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, searchQuery, limit, sort, currentPage, topics.length]);

  useEffect(() => {
    fetchTopics(false); // Fresh load when dependencies change
  }, [selectedCategory, searchQuery, sort, limit]); // Dependencies that should trigger fresh load

  const loadMoreTopics = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      fetchTopics(true);
    }
  }, [loadingMore, hasMoreData]); // Removed currentPage as it's not directly used

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
    loadingMore,
    error,
    paginationError,
    hasMoreData,
    currentPage,
    fetchTopics: () => fetchTopics(false), // Refresh topics
    loadMoreTopics,
    createTopic,
    createReply,
  };
} 