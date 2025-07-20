import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  category?: string;
  author?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'popularity' | 'activity';
  contentType?: 'topics' | 'replies' | 'all';
}

export interface SearchResult {
  id: string;
  type: 'topic' | 'reply';
  title?: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags?: string[];
  createdAt: string;
  relevanceScore: number;
  highlighted?: {
    title?: string;
    content?: string;
  };
}

export interface SearchFacets {
  categories: Array<{ id: string; name: string; count: number }>;
  authors: Array<{ id: string; username: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  facets: SearchFacets;
  suggestions: string[];
  searchTime: number;
}

export interface TrendingTopic {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    username: string;
    displayName: string;
  };
  category: {
    name: string;
  };
  replyCount: number;
  upvoteCount: number;
  trendingScore: number;
  createdAt: string;
}

export interface AutocompleteResponse {
  query: string;
  suggestions: string[];
}

class SearchService {
  private baseUrl = 'http://localhost:3001/api/search';

  /**
   * Perform full-text search
   */
  async search(
    query: string,
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: SearchResponse | null; error?: any }> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(',') : value?.toString() || ''
          ])
        )
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data };

    } catch (error) {
      console.error('Search error:', error);
      return { data: null, error };
    }
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocomplete(
    query: string,
    limit: number = 10
  ): Promise<{ data: AutocompleteResponse | null; error?: any }> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/autocomplete?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data };

    } catch (error) {
      console.error('Autocomplete error:', error);
      return { data: null, error };
    }
  }

  /**
   * Get trending topics
   */
  async getTrendingTopics(
    limit: number = 10
  ): Promise<{ data: TrendingTopic[] | null; error?: any }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/trending?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data.trending };

    } catch (error) {
      console.error('Trending topics error:', error);
      return { data: null, error };
    }
  }

  /**
   * Get related topics for a specific topic
   */
  async getRelatedTopics(
    topicId: string,
    limit: number = 5
  ): Promise<{ data: TrendingTopic[] | null; error?: any }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/related/${topicId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data.related };

    } catch (error) {
      console.error('Related topics error:', error);
      return { data: null, error };
    }
  }

  /**
   * Get popular search terms (admin only)
   */
  async getPopularSearchTerms(
    limit: number = 10,
    days: number = 7
  ): Promise<{ data: any[] | null; error?: any }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        days: days.toString()
      });

      // This would need authentication headers in a real implementation
      const response = await fetch(`${this.baseUrl}/popular?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data.popular };

    } catch (error) {
      console.error('Popular search terms error:', error);
      return { data: null, error };
    }
  }

  /**
   * Build search URL with filters for SEO
   */
  buildSearchUrl(query: string, filters: SearchFilters = {}): string {
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.author) params.set('author', filters.author);
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));
    if (filters.dateFrom) params.set('from', filters.dateFrom);
    if (filters.dateTo) params.set('to', filters.dateTo);
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    if (filters.contentType && filters.contentType !== 'all') params.set('type', filters.contentType);

    return `/search${params.toString() ? `?${params.toString()}` : ''}`;
  }

  /**
   * Parse search URL parameters
   */
  parseSearchUrl(searchParams: URLSearchParams): { query: string; filters: SearchFilters } {
    return {
      query: searchParams.get('q') || '',
      filters: {
        category: searchParams.get('category') || undefined,
        author: searchParams.get('author') || undefined,
        tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
        dateFrom: searchParams.get('from') || undefined,
        dateTo: searchParams.get('to') || undefined,
        sortBy: (searchParams.get('sort') as any) || 'relevance',
        contentType: (searchParams.get('type') as any) || 'all'
      }
    };
  }
}

export const searchService = new SearchService();
export default searchService;