import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SearchPage from '@/features/forum/components/SearchPage';
import { WebSocketProvider } from '@/features/forum/contexts/WebSocketContext';

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

  useEffect(() => {
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
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