import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Tag, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { searchService, SearchFilters } from '@/api/SearchService';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onResultsClick?: (query: string, filters: SearchFilters) => void;
  categories: any[];
  availableTags: string[];
  placeholder?: string;
  showTrending?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onResultsClick,
  categories, 
  availableTags,
  placeholder = "Search discussions, tags, or topics...",
  showTrending = true
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: undefined,
    author: undefined,
    tags: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: 'relevance',
    contentType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  // Autocomplete effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const { data } = await searchService.getAutocomplete(query, 8);
        if (data) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? undefined : categoryId
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return {
        ...prev,
        tags: newTags.length > 0 ? newTags : undefined
      };
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onResultsClick) {
      onResultsClick(suggestion, filters);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onResultsClick) {
      onResultsClick(query, filters);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: undefined,
      author: undefined,
      tags: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: 'relevance',
      contentType: 'all'
    });
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) + 
    (filters.tags?.length || 0) + 
    (filters.dateFrom || filters.dateTo ? 1 : 0) + 
    (filters.author ? 1 : 0) +
    (filters.sortBy !== 'relevance' ? 1 : 0) +
    (filters.contentType !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-10 pr-20 h-12 text-base"
          autoComplete="off"
        />

        {/* Autocomplete Suggestions */}
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Loading suggestions...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="flex-1">{suggestion}</span>
                  <Clock className="h-3 w-3 text-gray-300" />
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="absolute right-2 top-2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.category === category.id}
                          onCheckedChange={() => handleCategorySelect(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {availableTags.slice(0, 10).map((tag) => (
                      <Badge
                        key={tag}
                        variant={(filters.tags || []).includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <select
                    value={
                      !filters.dateFrom && !filters.dateTo ? 'all' :
                      filters.dateFrom === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? 'today' :
                      filters.dateFrom === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? 'week' :
                      filters.dateFrom === new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? 'month' :
                      'custom'
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const now = new Date();
                      if (value === 'all') {
                        setFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }));
                      } else if (value === 'today') {
                        setFilters(prev => ({ 
                          ...prev, 
                          dateFrom: new Date(now.setHours(0, 0, 0, 0)).toISOString().split('T')[0],
                          dateTo: undefined
                        }));
                      } else if (value === 'week') {
                        setFilters(prev => ({ 
                          ...prev, 
                          dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          dateTo: undefined
                        }));
                      } else if (value === 'month') {
                        setFilters(prev => ({ 
                          ...prev, 
                          dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          dateTo: undefined
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <select
                    value={filters.contentType}
                    onChange={(e) => handleFilterChange('contentType', e.target.value as 'topics' | 'replies' | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All content</option>
                    <option value="topics">Topics only</option>
                    <option value="replies">Replies only</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value as 'relevance' | 'date' | 'popularity' | 'activity')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Newest first</option>
                    <option value="popularity">Most popular</option>
                    <option value="activity">Most activity</option>
                  </select>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Author</label>
                  <Input
                    placeholder="Search by username"
                    value={filters.author}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              {categories.find(c => c.id === filters.category)?.name || 'Category'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategorySelect(filters.category!)}
              />
            </Badge>
          )}
          
          {filters.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
          
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateFrom && filters.dateTo ? 
                `${filters.dateFrom} - ${filters.dateTo}` :
                filters.dateFrom ? 
                `Since ${filters.dateFrom}` :
                `Until ${filters.dateTo}`
              }
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }))}
              />
            </Badge>
          )}
          
          {filters.contentType !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.contentType === 'topics' ? 'Topics only' : 'Replies only'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('contentType', 'all')}
              />
            </Badge>
          )}
          
          {filters.author && (
            <Badge variant="secondary" className="flex items-center gap-1">
              @{filters.author}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('author', undefined)}
              />
            </Badge>
          )}

          {filters.sortBy !== 'relevance' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {filters.sortBy}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('sortBy', 'relevance')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Quick search hint */}
      {query && !showSuggestions && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="p-3">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Press Enter to search for "{query}" across all discussions
              {activeFilterCount > 0 && (
                <span className="text-blue-600">
                  ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending topics hint */}
      {!query && showTrending && availableTags.length > 0 && (
        <Card className="border-dashed border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending topics:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-gray-50"
                  onClick={() => {
                    setQuery(tag);
                    if (onResultsClick) {
                      onResultsClick(tag, filters);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;