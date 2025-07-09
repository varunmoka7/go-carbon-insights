import React, { useState, useMemo } from 'react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortField = 'sector' | 'industry' | 'emissions_archetype';
type SortDirection = 'asc' | 'desc';

export function IndustryTaxonomyMasterList() {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('sector');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: archetypes, isLoading: archetypesLoading } = useEmissionsArchetypes();
  const { data: taxonomyData, isLoading: taxonomyLoading } = useIndustryTaxonomy(
    selectedArchetype || undefined
  );

  const filteredAndSortedData = useMemo(() => {
    if (!taxonomyData) return [];

    let filtered = taxonomyData;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.sector?.toLowerCase().includes(term) ||
          item.industry?.toLowerCase().includes(term) ||
          item.emissions_archetype?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [taxonomyData, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return (
      <ArrowUpDown 
        className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-primary' : 'text-primary rotate-180'}`} 
      />
    );
  };

  const clearFilters = () => {
    setSelectedArchetype('');
    setSearchTerm('');
    setSortField('sector');
    setSortDirection('asc');
  };

  if (taxonomyLoading || archetypesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Taxonomy Master List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading taxonomy data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Taxonomy Master List</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sectors, industries, or archetypes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Archetype Filter */}
          <div className="w-full sm:w-64">
            <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Emissions Archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Archetypes</SelectItem>
                {archetypes?.map((archetype) => (
                  <SelectItem key={archetype.id} value={archetype.name}>
                    {archetype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(selectedArchetype || searchTerm) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort('sector')}
                  >
                    Sector
                    {getSortIcon('sector')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort('industry')}
                  >
                    Industry
                    {getSortIcon('industry')}
                  </Button>
                </TableHead>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => handleSort('emissions_archetype')}
                  >
                    Emissions Archetype
                    {getSortIcon('emissions_archetype')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm || selectedArchetype 
                        ? 'No results found. Try adjusting your filters.'
                        : 'No taxonomy data available. Please upload the industry_taxonomy.csv file first.'
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.sector}</TableCell>
                    <TableCell>{item.industry}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.emissions_archetype}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedData.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredAndSortedData.length} of {taxonomyData?.length || 0} industries
          </div>
        )}
      </CardContent>
    </Card>
  );
}