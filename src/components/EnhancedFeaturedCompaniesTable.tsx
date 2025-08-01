import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { useSupabaseSectors } from '@/hooks/useSupabaseIndustries';
import { Search, Filter, Star, TrendingDown, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Company } from '@/types/company';
import CompanyIdentifiers from '@/components/CompanyIdentifiers';

const ITEMS_PER_PAGE = 10;

const EnhancedFeaturedCompaniesTable = () => {
  const { data: companies, isLoading: companiesLoading } = useSupabaseCompanies();
  const { data: sectors, isLoading: sectorsLoading } = useSupabaseSectors();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    return companies.filter((company: Company) => {
      const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.ticker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.lei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.exchange?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'all' || company.sector === selectedSector;
      
      return matchesSearch && matchesSector;
    });
  }, [companies, searchTerm, selectedSector]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1000000) {
      return `${(emissions / 1000000).toFixed(1)}M`;
    } else if (emissions >= 1000) {
      return `${(emissions / 1000).toFixed(1)}K`;
    }
    return emissions.toString();
  };

  // Optimized event handlers with useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleSectorChange = useCallback((value: string) => {
    setSelectedSector(value);
    setCurrentPage(1); // Reset to first page on filter
  }, []);

  // Simplified pagination logic
  const getPageNumbers = useCallback(() => {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with current page in center when possible
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [totalPages, currentPage]);

  if (companiesLoading || sectorsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Companies</CardTitle>
          <CardDescription>Loading company data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Featured Companies
        </CardTitle>
        <CardDescription>
          {filteredCompanies.length} companies tracked across {sectors?.length || 0} sectors
        </CardDescription>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies, industries, tickers, or identifiers..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSector} onValueChange={handleSectorChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors?.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {paginatedCompanies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No companies found matching your criteria.
          </div>
        ) : (
          <>
            {/* Companies List */}
            <div className="space-y-4">
              {paginatedCompanies.map((company: Company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{company.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {company.sector}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>Carbon Footprint:</span>
                        <span className="font-medium text-gray-900">
                          {formatEmissions(company.totalEmissions)} tCO2e
                        </span>
                      </div>
                      
                      {company.renewableEnergyPercentage && (
                        <div className="flex items-center gap-1">
                          <span>Renewable:</span>
                          <span className="font-medium text-green-600">
                            {company.renewableEnergyPercentage}%
                          </span>
                        </div>
                      )}
                      
                      {/* Company Identifiers */}
                      <CompanyIdentifiers company={company} variant="compact" />
                      
                      {company.description && (
                        <div className="text-xs text-gray-500 max-w-md truncate">
                          {company.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <Award className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedFeaturedCompaniesTable;