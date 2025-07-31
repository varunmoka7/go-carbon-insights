import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'company' | 'emission' | 'report' | 'private';
  source: 'public' | 'private' | 'combined';
  relevance: number;
}

interface UnifiedSearchBarProps {
  className?: string;
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
}

export const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  className = '',
  placeholder,
  onResultSelect,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { viewMode } = useViewModeContext();
  const { 
    searchResults, 
    searchHistory, 
    suggestions, 
    isLoading, 
    search, 
    clearHistory 
  } = useUnifiedSearch();

  const defaultPlaceholder = `Search ${viewMode} data...`;

  // Handle search input changes
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      search(value, viewMode);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleResultSelect(searchResults[selectedIndex]);
        } else if (query.trim()) {
          search(query, viewMode);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    setQuery(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle search history selection
  const handleHistorySelect = (historyItem: string) => {
    setQuery(historyItem);
    search(historyItem, viewMode);
    setIsOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() || searchHistory.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder || defaultPlaceholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchResults.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Search Results
              </div>
              {searchResults.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-2 rounded cursor-pointer hover:bg-accent ${
                    index === selectedIndex ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={result.source === 'private' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {result.source}
                    </Badge>
                    <span className="font-medium">{result.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Search History */}
          {!isLoading && searchResults.length === 0 && searchHistory.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={clearHistory}
                >
                  Clear
                </Button>
              </div>
              {searchHistory.slice(0, 5).map((historyItem, index) => (
                <div
                  key={index}
                  className="p-2 rounded cursor-pointer hover:bg-accent flex items-center gap-2"
                  onClick={() => handleHistorySelect(historyItem)}
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{historyItem}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && searchResults.length === 0 && searchHistory.length === 0 && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular Searches
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 rounded cursor-pointer hover:bg-accent"
                  onClick={() => handleHistorySelect(suggestion)}
                >
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchResults.length === 0 && searchHistory.length === 0 && suggestions.length === 0 && query.trim() && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};