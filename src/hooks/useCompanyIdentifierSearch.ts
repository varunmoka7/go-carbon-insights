import { useState, useMemo } from 'react';
import { Company } from '@/types/company';

export interface IdentifierSearchResult {
  company: Company;
  matchedIdentifier: string;
  identifierType: 'ticker' | 'lei' | 'figi' | 'permid' | 'name';
  confidence: number;
}

interface UseCompanyIdentifierSearchProps {
  companies: Company[];
}

export const useCompanyIdentifierSearch = ({ companies }: UseCompanyIdentifierSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo((): IdentifierSearchResult[] => {
    if (!searchQuery.trim() || !companies.length) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const results: IdentifierSearchResult[] = [];

    companies.forEach((company) => {
      // Exact ticker match (highest priority)
      if (company.ticker?.toLowerCase() === query) {
        results.push({
          company,
          matchedIdentifier: company.ticker,
          identifierType: 'ticker',
          confidence: 1.0
        });
        return;
      }

      // Exact LEI match
      if (company.lei?.toLowerCase() === query) {
        results.push({
          company,
          matchedIdentifier: company.lei,
          identifierType: 'lei',
          confidence: 1.0
        });
        return;
      }

      // Exact FIGI match
      if (company.figi?.toLowerCase() === query) {
        results.push({
          company,
          matchedIdentifier: company.figi,
          identifierType: 'figi',
          confidence: 1.0
        });
        return;
      }

      // Exact PermID match
      if (company.permid?.toLowerCase() === query) {
        results.push({
          company,
          matchedIdentifier: company.permid,
          identifierType: 'permid',
          confidence: 1.0
        });
        return;
      }

      // Partial matches with lower confidence
      // Company name match
      if (company.name?.toLowerCase().includes(query)) {
        const confidence = query.length / company.name.length;
        results.push({
          company,
          matchedIdentifier: company.name,
          identifierType: 'name',
          confidence: Math.min(confidence, 0.8) // Cap at 0.8 for name matches
        });
        return;
      }

      // Partial ticker match
      if (company.ticker?.toLowerCase().includes(query)) {
        const confidence = query.length / company.ticker.length;
        results.push({
          company,
          matchedIdentifier: company.ticker,
          identifierType: 'ticker',
          confidence: Math.min(confidence, 0.7)
        });
        return;
      }

      // Partial LEI match (useful for shortened LEI searches)
      if (company.lei?.toLowerCase().includes(query) && query.length >= 4) {
        const confidence = query.length / company.lei.length;
        results.push({
          company,
          matchedIdentifier: company.lei,
          identifierType: 'lei',
          confidence: Math.min(confidence, 0.6)
        });
      }
    });

    // Sort by confidence (highest first), then by identifier type priority
    return results.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return b.confidence - a.confidence;
      }
      
      // Type priority: ticker > lei > figi > permid > name
      const typePriority = {
        ticker: 5,
        lei: 4,
        figi: 3,
        permid: 2,
        name: 1
      };
      
      return typePriority[b.identifierType] - typePriority[a.identifierType];
    });
  }, [companies, searchQuery]);

  const getSearchSuggestions = (partialQuery: string, limit = 5): string[] => {
    if (!partialQuery.trim() || partialQuery.length < 2) {
      return [];
    }

    const query = partialQuery.toLowerCase();
    const suggestions = new Set<string>();

    companies.forEach((company) => {
      // Ticker suggestions
      if (company.ticker?.toLowerCase().startsWith(query)) {
        suggestions.add(company.ticker);
      }
      
      // LEI suggestions (if query is at least 4 characters)
      if (partialQuery.length >= 4 && company.lei?.toLowerCase().startsWith(query)) {
        suggestions.add(company.lei.substring(0, 12) + '...');
      }
      
      // Company name suggestions
      if (company.name?.toLowerCase().startsWith(query)) {
        suggestions.add(company.name);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  };

  const validateIdentifier = (identifier: string, type: 'lei' | 'ticker' | 'figi' | 'permid'): boolean => {
    switch (type) {
      case 'lei':
        // LEI format: 20 alphanumeric characters
        return /^[A-Z0-9]{20}$/.test(identifier.toUpperCase());
      case 'ticker':
        // Basic ticker validation: 1-6 uppercase letters
        return /^[A-Z]{1,6}$/.test(identifier.toUpperCase());
      case 'figi':
        // FIGI format: BBG followed by 9 alphanumeric characters
        return /^BBG[A-Z0-9]{9}$/.test(identifier.toUpperCase());
      case 'permid':
        // PermID: numeric string, typically 10-12 digits
        return /^\d{10,12}$/.test(identifier);
      default:
        return false;
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    getSearchSuggestions,
    validateIdentifier,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length
  };
};

export default useCompanyIdentifierSearch;