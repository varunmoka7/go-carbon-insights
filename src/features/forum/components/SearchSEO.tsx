import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SearchFilters, SearchResponse } from '@/api/SearchService';

interface SearchSEOProps {
  query: string;
  filters: SearchFilters;
  searchResponse?: SearchResponse | null;
  currentPage?: number;
}

const SearchSEO: React.FC<SearchSEOProps> = ({
  query,
  filters,
  searchResponse,
  currentPage = 1,
}) => {
  // Build the page title
  const buildTitle = (): string => {
    const baseTitle = 'GoCarbonTracker Community Forum';
    
    if (!query) {
      return `Search - ${baseTitle}`;
    }

    const resultCount = searchResponse?.totalCount || 0;
    const pageInfo = currentPage > 1 ? ` - Page ${currentPage}` : '';
    
    return `"${query}" - ${resultCount.toLocaleString()} results${pageInfo} | ${baseTitle}`;
  };

  // Build the meta description
  const buildDescription = (): string => {
    if (!query) {
      return 'Search through topics and discussions in the GoCarbonTracker community forum. Find answers, share knowledge, and connect with other carbon tracking enthusiasts.';
    }

    const resultCount = searchResponse?.totalCount || 0;
    let description = `Search results for "${query}" in GoCarbonTracker forum. `;
    
    if (resultCount > 0) {
      description += `Found ${resultCount.toLocaleString()} relevant ${resultCount === 1 ? 'result' : 'results'} `;
      
      // Add filter context
      const filterContext = [];
      if (filters.category) filterContext.push(`in category`);
      if (filters.contentType === 'topics') filterContext.push('topics only');
      if (filters.contentType === 'replies') filterContext.push('replies only');
      if (filters.tags?.length) filterContext.push(`tagged with ${filters.tags.slice(0, 2).join(', ')}`);
      
      if (filterContext.length > 0) {
        description += `(${filterContext.join(', ')}) `;
      }
      
      description += 'about carbon tracking, sustainability, and environmental topics.';
    } else {
      description += 'No results found. Try different keywords or browse our trending topics.';
    }

    return description.substring(0, 160); // Limit to 160 characters for SEO
  };

  // Build keywords
  const buildKeywords = (): string => {
    const baseKeywords = [
      'carbon tracking',
      'sustainability forum',
      'environmental community',
      'climate change',
      'carbon footprint',
      'eco-friendly',
      'green living'
    ];

    const searchKeywords = [];
    
    if (query) {
      searchKeywords.push(query);
    }
    
    if (filters.tags?.length) {
      searchKeywords.push(...filters.tags);
    }

    // Add popular search terms from response if available
    if (searchResponse?.suggestions?.length) {
      searchKeywords.push(...searchResponse.suggestions.slice(0, 3));
    }

    return [...new Set([...searchKeywords, ...baseKeywords])].join(', ');
  };

  // Build canonical URL
  const buildCanonicalUrl = (): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gocarbontracker.com';
    const searchParams = new URLSearchParams();
    
    if (query) searchParams.set('q', query);
    if (filters.category) searchParams.set('category', filters.category);
    if (filters.author) searchParams.set('author', filters.author);
    if (filters.tags?.length) searchParams.set('tags', filters.tags.join(','));
    if (filters.dateFrom) searchParams.set('from', filters.dateFrom);
    if (filters.dateTo) searchParams.set('to', filters.dateTo);
    if (filters.sortBy && filters.sortBy !== 'relevance') searchParams.set('sort', filters.sortBy);
    if (filters.contentType && filters.contentType !== 'all') searchParams.set('type', filters.contentType);
    if (currentPage > 1) searchParams.set('page', currentPage.toString());

    const queryString = searchParams.toString();
    return `${baseUrl}/search${queryString ? `?${queryString}` : ''}`;
  };

  // Build structured data for search results
  const buildStructuredData = () => {
    if (!query || !searchResponse?.results?.length) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: buildTitle(),
      description: buildDescription(),
      url: buildCanonicalUrl(),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: searchResponse.totalCount,
        itemListElement: searchResponse.results.slice(0, 5).map((result, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': result.type === 'topic' ? 'DiscussionForumPosting' : 'Comment',
            '@id': `${buildCanonicalUrl()}#result-${result.id}`,
            name: result.title || `Reply: ${result.excerpt.substring(0, 50)}...`,
            text: result.excerpt,
            dateCreated: result.createdAt,
            author: {
              '@type': 'Person',
              name: result.author.displayName,
              identifier: result.author.username
            },
            ...(result.category && {
              about: {
                '@type': 'Thing',
                name: result.category.name
              }
            })
          }
        }))
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${buildCanonicalUrl().split('?')[0]}?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    return JSON.stringify(structuredData);
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{buildTitle()}</title>
      <meta name="description" content={buildDescription()} />
      <meta name="keywords" content={buildKeywords()} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={buildCanonicalUrl()} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={buildTitle()} />
      <meta property="og:description" content={buildDescription()} />
      <meta property="og:url" content={buildCanonicalUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="GoCarbonTracker Community Forum" />
      <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : 'https://gocarbontracker.com'}/images/forum-search-og.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={buildTitle()} />
      <meta name="twitter:description" content={buildDescription()} />
      <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : 'https://gocarbontracker.com'}/images/forum-search-twitter.jpg`} />
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={query && searchResponse?.results?.length ? 'index,follow' : 'noindex,follow'} 
      />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="GoCarbonTracker Community" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Pagination Meta Tags */}
      {currentPage > 1 && (
        <link 
          rel="prev" 
          href={buildCanonicalUrl().replace(`page=${currentPage}`, `page=${currentPage - 1}`)} 
        />
      )}
      
      {searchResponse && searchResponse.results.length > 0 && searchResponse.totalCount > currentPage * 20 && (
        <link 
          rel="next" 
          href={buildCanonicalUrl() + (buildCanonicalUrl().includes('?') ? '&' : '?') + `page=${currentPage + 1}`} 
        />
      )}

      {/* Structured Data */}
      {buildStructuredData() && (
        <script type="application/ld+json">
          {buildStructuredData()}
        </script>
      )}
      
      {/* Search Engine Specific Meta Tags */}
      <meta name="googlebot" content={query && searchResponse?.results?.length ? 'index,follow' : 'noindex,follow'} />
      <meta name="bingbot" content={query && searchResponse?.results?.length ? 'index,follow' : 'noindex,follow'} />
    </Helmet>
  );
};

export default SearchSEO;