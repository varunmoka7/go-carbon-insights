import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  categories: any[];
  availableTags: string[];
}

interface SearchFilters {
  categories: string[];
  tags: string[];
  dateRange: string;
  author: string;
  sortBy: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  categories, 
  availableTags 
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    tags: [],
    dateRange: 'all',
    author: '',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      dateRange: 'all',
      author: '',
      sortBy: 'relevance'
    });
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.tags.length + 
    (filters.dateRange !== 'all' ? 1 : 0) + 
    (filters.author ? 1 : 0) +
    (filters.sortBy !== 'relevance' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search discussions, tags, or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20 h-12 text-base"
        />
        
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
                  <label className="text-sm font-medium">Categories</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
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
                  <label className="text-sm font-medium">Popular Tags</label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {availableTags.slice(0, 10).map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
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
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="most_replies">Most replies</option>
                    <option value="most_views">Most views</option>
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
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <Badge
                key={categoryId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleCategoryToggle(categoryId)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.tags.map((tag) => (
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
          
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateRange}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('dateRange', 'all')}
              />
            </Badge>
          )}
          
          {filters.author && (
            <Badge variant="secondary" className="flex items-center gap-1">
              @{filters.author}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('author', '')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {query && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="p-3">
            <div className="text-sm text-gray-600">
              Press Enter to search for "{query}" across all discussions
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;