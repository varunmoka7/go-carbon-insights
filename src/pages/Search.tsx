import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SearchPage from '@/features/forum/components/SearchPage';
import { WebSocketProvider } from '@/features/forum/contexts/WebSocketContext';
import { Spinner } from '@/components/ui/spinner';

// Mock data - these would normally come from API calls
const mockCategories = [
  { id: '1', name: 'Carbon Tracking', description: 'General carbon footprint tracking discussions' },
  { id: '2', name: 'Scope 1 Emissions', description: 'Direct emissions from owned sources' },
  { id: '3', name: 'Scope 2 Emissions', description: 'Indirect emissions from purchased energy' },
  { id: '4', name: 'Scope 3 Emissions', description: 'Other indirect emissions' },
  { id: '5', name: 'Sustainability', description: 'General sustainability topics' },
  { id: '6', name: 'Tools & Software', description: 'Discussion about carbon tracking tools' },
  { id: '7', name: 'Industry News', description: 'Latest news in carbon management' },
  { id: '8', name: 'Best Practices', description: 'Sharing best practices and methodologies' }
];

const mockTags = [
  'carbon-footprint',
  'emissions',
  'sustainability',
  'renewable-energy',
  'ghg-protocol',
  'climate-change',
  'net-zero',
  'carbon-offset',
  'energy-efficiency',
  'green-building',
  'supply-chain',
  'reporting',
  'verification',
  'methodology',
  'data-collection',
  'benchmarking',
  'reduction-targets',
  'life-cycle-assessment',
  'environmental-impact',
  'corporate-sustainability'
];

const Search: React.FC = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [availableTags, setAvailableTags] = useState(mockTags);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add debugging information
    console.log('Search component mounted');
    
    // Simulate API calls to fetch categories and tags
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls:
        // const categoriesResponse = await fetch('/api/categories');
        // const categories = await categoriesResponse.json();
        // setCategories(categories);
        
        // const tagsResponse = await fetch('/api/tags/popular');
        // const tags = await tagsResponse.json();
        // setAvailableTags(tags);
        
        // For now, just use mock data with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch search data:', error);
        setError('Failed to load search data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Search
            </h3>
            <p className="text-red-600 text-sm">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <WebSocketProvider>
        <SearchPage 
          categories={categories}
          availableTags={availableTags}
        />
      </WebSocketProvider>
    </HelmetProvider>
  );
};

export default Search;