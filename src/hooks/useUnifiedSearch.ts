import { useState, useEffect, useCallback } from 'react';
import { ViewMode } from '@/contexts/ViewModeContext';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'company' | 'emission' | 'report' | 'private';
  source: 'public' | 'private' | 'combined';
  relevance: number;
}

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  viewMode: ViewMode;
  resultsCount: number;
}

export const useUnifiedSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('unified-search-history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(history.slice(0, 10)); // Keep last 10 searches
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((query: string) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('unified-search-history', JSON.stringify(newHistory));
  }, [searchHistory]);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('unified-search-history');
  }, []);

  // Mock search function - replace with actual API calls
  const search = useCallback(async (query: string, viewMode: ViewMode) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    saveSearchHistory(query);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock search results based on view mode
      const mockResults: SearchResult[] = [];

      if (viewMode === 'public' || viewMode === 'combined') {
        mockResults.push(
          {
            id: '1',
            title: 'Apple Inc.',
            description: 'Technology company with comprehensive ESG reporting',
            type: 'company',
            source: 'public',
            relevance: 0.95,
          },
          {
            id: '2',
            title: 'Carbon Emissions Report 2024',
            description: 'Annual sustainability report with detailed emissions data',
            type: 'report',
            source: 'public',
            relevance: 0.87,
          },
          {
            id: '3',
            title: 'Scope 1 Emissions Data',
            description: 'Direct greenhouse gas emissions from operations',
            type: 'emission',
            source: 'public',
            relevance: 0.82,
          }
        );
      }

      if (viewMode === 'private' || viewMode === 'combined') {
        mockResults.push(
          {
            id: '4',
            title: 'My Organization Emissions',
            description: 'Private emissions data for your organization',
            type: 'private',
            source: 'private',
            relevance: 0.98,
          },
          {
            id: '5',
            title: 'Internal Sustainability Report',
            description: 'Confidential sustainability analysis and recommendations',
            type: 'report',
            source: 'private',
            relevance: 0.91,
          }
        );
      }

      // Filter results based on query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [saveSearchHistory]);

  // Load suggestions based on view mode
  const loadSuggestions = useCallback((viewMode: ViewMode) => {
    const publicSuggestions = [
      'Apple Inc.',
      'Microsoft Corporation',
      'Google emissions',
      'Sustainability reports',
      'Carbon footprint',
      'ESG metrics',
      'Climate action',
      'Green energy',
    ];

    const privateSuggestions = [
      'My organization',
      'Internal reports',
      'Team emissions',
      'Private data',
      'Confidential reports',
      'Organization metrics',
    ];

    const combinedSuggestions = [
      'Benchmark comparison',
      'Industry analysis',
      'Best practices',
      'Compliance reports',
    ];

    let modeSuggestions: string[] = [];
    switch (viewMode) {
      case 'public':
        modeSuggestions = publicSuggestions;
        break;
      case 'private':
        modeSuggestions = privateSuggestions;
        break;
      case 'combined':
        modeSuggestions = [...publicSuggestions, ...privateSuggestions, ...combinedSuggestions];
        break;
    }

    setSuggestions(modeSuggestions.slice(0, 8));
  }, []);

  // Load suggestions when view mode changes
  useEffect(() => {
    // This will be called when view mode changes
    // For now, we'll load public suggestions by default
    loadSuggestions('public');
  }, [loadSuggestions]);

  return {
    searchResults,
    searchHistory,
    suggestions,
    isLoading,
    search,
    clearHistory,
    loadSuggestions,
  };
};