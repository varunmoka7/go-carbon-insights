import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Search, Filter, BarChart3, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchService, SearchFilters, SearchResponse } from '@/api/SearchService';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import SearchSEO from './SearchSEO';
import TrendingTopics from './TrendingTopics';
import RelatedTopics from './RelatedTopics';

interface SearchPageProps {
  categories?: any[];
  availableTags?: string[];
}

const SearchPage: React.FC<SearchPageProps> = ({
  categories = [],
  availableTags = [],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Parse initial state from URL
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return searchService.parseSearchUrl(searchParams).filters;
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search state
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'results' | 'trending' | 'facets'>('results');
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  // Perform search
  const performSearch = useCallback(async (
    searchQuery: string, 
    searchFilters: SearchFilters, 
    page: number = 1,
    append: boolean = false
  ) => {
    if (!searchQuery.trim()) {
      setSearchResponse(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: searchError } = await searchService.search(
        searchQuery,
        searchFilters,
        page,
        20
      );
      
      if (searchError) {
        throw new Error('Search failed');
      }
      
      if (data) {
        if (append && searchResponse) {
          // Append results for "load more"
          setSearchResponse(prev => prev ? {
            ...data,
            results: [...prev.results, ...data.results]
          } : data);
        } else {
          setSearchResponse(data);
        }
        
        setHasMore(data.results.length === 20 && data.totalCount > page * 20);
        
        // Switch to results tab if we have results
        if (data.results.length > 0 && activeTab !== 'results') {
          setActiveTab('results');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [searchResponse, activeTab]);

  // Update URL when search changes
  const updateURL = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    const url = searchService.buildSearchUrl(searchQuery, searchFilters);
    const newSearchParams = new URLSearchParams(url.split('?')[1] || '');
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  // Handle search from SearchBar
  const handleSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
    setCurrentPage(1);
    setSelectedResult(null);
    
    // Update URL
    updateURL(searchQuery, searchFilters);
    
    // Perform search
    performSearch(searchQuery, searchFilters, 1);
  }, [updateURL, performSearch]);

  // Handle "View Results" click from SearchBar
  const handleResultsClick = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    handleSearch(searchQuery, searchFilters);
    setActiveTab('results');
  }, [handleSearch]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    performSearch(query, filters, nextPage, true);
  }, [currentPage, query, filters, performSearch]);

  // Handle individual result click
  const handleResultClick = useCallback((result: any) => {
    setSelectedResult(result.id);
    
    // Navigate to the result
    if (result.type === 'topic') {
      navigate(`/forum/topics/${result.id}`);
    } else {
      navigate(`/forum/topics/${result.topicId}#reply-${result.id}`);
    }
  }, [navigate]);

  // Handle trending topic click
  const handleTrendingClick = useCallback((topic: any) => {
    navigate(`/forum/topics/${topic.slug || topic.id}`);
  }, [navigate]);

  // Initial search effect
  useEffect(() => {
    const initialQuery = searchParams.get('q') || '';
    if (initialQuery) {
      const { query: urlQuery, filters: urlFilters } = searchService.parseSearchUrl(searchParams);
      performSearch(urlQuery, urlFilters);
    }
  }, []); // Only run on mount

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SearchSEO
          query={query}
          filters={filters}
          searchResponse={searchResponse}
          currentPage={currentPage}
        />
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Search Community Forum
                  </h1>
                  <p className="text-gray-600">
                    Find discussions, topics, and insights from the carbon tracking community
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <SearchBar
                onSearch={handleSearch}
                onResultsClick={handleResultsClick}
                categories={categories}
                availableTags={availableTags}
                showTrending={true}
                isLoadingCategories={categoriesLoading}
                isLoadingTags={tagsLoading}
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Search Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Tab Navigation */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="results" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Results
                      {searchResponse && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {searchResponse.totalCount.toLocaleString()}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="facets" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </TabsTrigger>
                  </TabsList>

                  {/* Search Results Tab */}
                  <TabsContent value="results" className="mt-6">
                    {error ? (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-red-500 mb-2">Search Error</div>
                          <p className="text-gray-600">{error}</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <SearchResults
                        searchResponse={searchResponse}
                        isLoading={isLoading}
                        query={query}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        onResultClick={handleResultClick}
                      />
                    )}
                  </TabsContent>

                  {/* Trending Tab */}
                  <TabsContent value="trending" className="mt-6">
                    <TrendingTopics
                      limit={20}
                      showHeader={false}
                      onTopicClick={handleTrendingClick}
                    />
                  </TabsContent>

                  {/* Facets Tab */}
                  <TabsContent value="facets" className="mt-6">
                    {searchResponse?.facets && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Categories Facet */}
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                            <div className="space-y-2">
                              {searchResponse.facets.categories.map((category) => (
                                <div key={category.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700">{category.name}</span>
                                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {category.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Authors Facet */}
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Top Authors</h3>
                            <div className="space-y-2">
                              {searchResponse.facets.authors.map((author) => (
                                <div key={author.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700">{author.username}</span>
                                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {author.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Tags Facet */}
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Popular Tags</h3>
                            <div className="space-y-2">
                              {searchResponse.facets.tags.map((tag) => (
                                <div key={tag.name} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700">#{tag.name}</span>
                                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {tag.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics Sidebar */}
                <TrendingTopics
                  limit={5}
                  onTopicClick={handleTrendingClick}
                />

                {/* Related Topics (show if viewing a specific result) */}
                {selectedResult && (
                  <RelatedTopics
                    topicId={selectedResult}
                    limit={3}
                    onTopicClick={handleTrendingClick}
                  />
                )}

                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Community Stats
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Topics</span>
                        <span className="font-medium">2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Replies</span>
                        <span className="font-medium">18,392</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Members</span>
                        <span className="font-medium">1,205</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default SearchPage;