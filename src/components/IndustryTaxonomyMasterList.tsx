import React, { useState, useMemo } from 'react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown, ArrowUpDown, Search, Filter, BarChart3, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type SortField = 'sector' | 'industry' | 'emissions_archetype';
type SortDirection = 'asc' | 'desc';

export function IndustryTaxonomyMasterList() {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('sector');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: archetypes = [], isLoading: archetypesLoading } = useEmissionsArchetypes();
  const { data: taxonomyData = [], isLoading: taxonomyLoading } = useIndustryTaxonomy();

  // Get unique sectors for filtering
  const uniqueSectors = useMemo(() => {
    const sectors = [...new Set(taxonomyData.map(item => item.sector))].filter(Boolean);
    return sectors.sort();
  }, [taxonomyData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = taxonomyData;

    // Apply archetype filter
    if (selectedArchetype) {
      filtered = filtered.filter(item => item.emissions_archetype === selectedArchetype);
    }

    // Apply sector filter
    if (selectedSector) {
      filtered = filtered.filter(item => item.sector === selectedSector);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.industry?.toLowerCase().includes(term) ||
        item.sector?.toLowerCase().includes(term) ||
        item.emissions_archetype?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.ghg_protocol_alignment?.toLowerCase().includes(term) ||
        item.cdp_category?.toLowerCase().includes(term) ||
        item.sbti_pathway?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [taxonomyData, selectedArchetype, selectedSector, searchTerm, sortField, sortDirection]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalIndustries = filteredAndSortedData.length;
    
    // Count by archetype
    const archetypeCounts = filteredAndSortedData.reduce((acc, item) => {
      const archetype = item.emissions_archetype || 'Unknown';
      acc[archetype] = (acc[archetype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by sector
    const sectorCounts = filteredAndSortedData.reduce((acc, item) => {
      const sector = item.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIndustries,
      archetypeCounts,
      sectorCounts
    };
  }, [filteredAndSortedData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4" /> : 
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const clearFilters = () => {
    setSelectedArchetype('');
    setSelectedSector('');
    setSearchTerm('');
    setSortField('sector');
    setSortDirection('asc');
  };

  const getArchetypeBadgeVariant = (archetype: string) => {
    switch (archetype) {
      case 'Operational Emitter': return 'destructive';
      case 'Use-phase Dominant': return 'secondary';
      case 'Upstream-heavy': return 'outline';
      case 'Lifecycle-dependent': return 'default';
      case 'Scope 2-heavy': return 'secondary';
      case 'Offset-focused': return 'default';
      case 'Financed Emissions (Scope 3 Cat 15)': return 'outline';
      default: return 'default';
    }
  };

  if (taxonomyLoading || archetypesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Industry Taxonomy Master Explorer</h1>
        <p className="text-muted-foreground">
          Comprehensive view of {taxonomyData.length} industries across sectors with emissions archetype classifications
        </p>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Industries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIndustries}</div>
            <p className="text-xs text-muted-foreground">
              Filtered from {taxonomyData.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emissions Archetypes</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.archetypeCounts).length}</div>
            <div className="mt-2 space-y-1">
              {Object.entries(stats.archetypeCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([archetype, count]) => (
                  <div key={archetype} className="flex justify-between text-xs">
                    <span className="truncate">{archetype.split(' ')[0]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sectors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.sectorCounts).length}</div>
            <div className="mt-2 space-y-1">
              {Object.entries(stats.sectorCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([sector, count]) => (
                  <div key={sector} className="flex justify-between text-xs">
                    <span className="truncate">{sector.split(' ')[0]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search industries, sectors, archetypes, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sector Filter */}
            <div className="w-full md:w-64">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sectors</SelectItem>
                  {uniqueSectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Archetype Filter */}
            <div className="w-full md:w-64">
              <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Archetype" />
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
            {(selectedArchetype || selectedSector || searchTerm) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Data</CardTitle>
          <CardDescription>
            Showing {filteredAndSortedData.length} of {taxonomyData.length} industries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('sector')}
                    >
                      Sector
                      {getSortIcon('sector')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[250px]">
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
                  <TableHead className="w-[150px]">Description</TableHead>
                  <TableHead className="w-[150px]">GHG Protocol</TableHead>
                  <TableHead className="w-[120px]">CDP Category</TableHead>
                  <TableHead className="w-[120px]">SBTi Pathway</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || selectedArchetype || selectedSector
                          ? 'No results found. Try adjusting your filters.'
                          : 'No taxonomy data available.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sector}</TableCell>
                      <TableCell className="font-medium">{item.industry}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getArchetypeBadgeVariant(item.emissions_archetype)} 
                          className="text-xs whitespace-nowrap"
                        >
                          {item.emissions_archetype}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {item.description || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.ghg_protocol_alignment || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.cdp_category || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.sbti_pathway || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}