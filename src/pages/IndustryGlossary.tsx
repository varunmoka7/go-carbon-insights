import { useState, useMemo } from 'react';
import { Search, Filter, Info, Grid3X3, List, Layers3, BarChart3, X, Eye } from 'lucide-react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const IndustryGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'grouped' | 'table'>('grid');
  const [hotspotMode, setHotspotMode] = useState(false);
  
  const { data: taxonomyData, isLoading: taxonomyLoading } = useIndustryTaxonomy();
  const { data: archetypes, isLoading: archetypesLoading } = useEmissionsArchetypes();

  // Get unique values for filters
  const sectors = useMemo(() => {
    if (!taxonomyData) return [];
    const uniqueSectors = [...new Set(taxonomyData.map(item => item.sector))];
    return uniqueSectors.sort();
  }, [taxonomyData]);

  const uniqueArchetypes = useMemo(() => {
    if (!taxonomyData) return [];
    const archetypes = [...new Set(taxonomyData.map(item => item.emissions_archetype))];
    return archetypes.sort();
  }, [taxonomyData]);

  const uniquePathways = useMemo(() => {
    if (!taxonomyData) return [];
    const pathways = [...new Set(taxonomyData.map(item => item.sbti_pathway))];
    return pathways.sort();
  }, [taxonomyData]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!taxonomyData) return [];
    
    return taxonomyData.filter(item => {
      const matchesSearch = item.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.emissions_archetype.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = selectedSector === 'all' || item.sector === selectedSector;
      const matchesArchetype = selectedArchetypes.length === 0 || selectedArchetypes.includes(item.emissions_archetype);
      const matchesPathway = selectedPathways.length === 0 || selectedPathways.includes(item.sbti_pathway);
      
      return matchesSearch && matchesSector && matchesArchetype && matchesPathway;
    });
  }, [taxonomyData, searchTerm, selectedSector, selectedArchetypes, selectedPathways]);

  // Statistics for KPI cards
  const stats = useMemo(() => {
    if (!taxonomyData) return { total: 0, sectors: 0, archetypes: 0 };
    return {
      total: taxonomyData.length,
      sectors: new Set(taxonomyData.map(item => item.sector)).size,
      archetypes: new Set(taxonomyData.map(item => item.emissions_archetype)).size
    };
  }, [taxonomyData]);

  // Chart data for archetype distribution
  const archetypeChartData = useMemo(() => {
    if (!taxonomyData) return [];
    const counts: Record<string, number> = {};
    taxonomyData.forEach(item => {
      counts[item.emissions_archetype] = (counts[item.emissions_archetype] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [taxonomyData]);

  // Sector distribution for pie chart
  const sectorChartData = useMemo(() => {
    if (!taxonomyData) return [];
    const counts: Record<string, number> = {};
    taxonomyData.forEach(item => {
      counts[item.sector] = (counts[item.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [taxonomyData]);

  // Group by sector for organized display
  const groupedData = useMemo(() => {
    const groups: Record<string, typeof filteredData> = {};
    filteredData.forEach(item => {
      if (!groups[item.sector]) {
        groups[item.sector] = [];
      }
      groups[item.sector].push(item);
    });
    return groups;
  }, [filteredData]);

  // Color palette for charts
  const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedArchetypes([]);
    setSelectedPathways([]);
    setHotspotMode(false);
  };

  // Toggle archetype filter
  const toggleArchetype = (archetype: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(archetype) 
        ? prev.filter(a => a !== archetype)
        : [...prev, archetype]
    );
  };

  // Toggle pathway filter
  const togglePathway = (pathway: string) => {
    setSelectedPathways(prev => 
      prev.includes(pathway) 
        ? prev.filter(p => p !== pathway)
        : [...prev, pathway]
    );
  };

  // Handle hotspot mode
  const hotspotArchetypes = ['Operational Emitter', 'Upstream-heavy'];
  const toggleHotspotMode = () => {
    setHotspotMode(!hotspotMode);
    if (!hotspotMode) {
      setSelectedArchetypes(hotspotArchetypes);
    } else {
      setSelectedArchetypes([]);
    }
  };

  const getArchetypeBadgeVariant = (archetype: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (archetype.toLowerCase()) {
      case 'operational emitter':
        return 'destructive';
      case 'upstream-heavy':
        return 'secondary';
      case 'use-phase dominant':
        return 'outline';
      case 'scope 2-heavy':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (taxonomyLoading || archetypesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* PHASE 1: Summary Header Panel */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-6 py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Industry Glossary</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Explore our ESG-classified industry universe with aligned emissions archetypes, protocol mappings, and net-zero pathways.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Layers3 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Industries Tracked</p>
                        <p className="text-3xl font-bold">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sectors</p>
                        <p className="text-3xl font-bold">{stats.sectors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-accent">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Emissions Archetypes</p>
                        <p className="text-3xl font-bold">{stats.archetypes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PHASE 2: Visual Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emissions Archetype Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={archetypeChartData}>
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sector Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={sectorChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                          {sectorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search and Sector Filter */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search industries, sectors, descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={hotspotMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleHotspotMode}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Carbon Hotspots
                </Button>

                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grouped' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grouped')}
                  >
                    <Layers3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Archetype Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">Archetypes:</span>
                {uniqueArchetypes.map(archetype => (
                  <Button
                    key={archetype}
                    variant={selectedArchetypes.includes(archetype) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArchetype(archetype)}
                    className="h-7 text-xs"
                  >
                    {archetype}
                  </Button>
                ))}
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedSector !== 'all' || selectedArchetypes.length > 0 || selectedPathways.length > 0) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {stats.total} industries
              </span>
            </div>
          </div>
        </div>

        {/* PHASE 3: Main Content Area */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'grouped' | 'table')}>
            {/* Grid View */}
            <TabsContent value="grid" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.map((industry) => (
                  <Card key={industry.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {industry.industry}
                        </CardTitle>
                        <Badge 
                          variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
                          className="text-xs shrink-0"
                        >
                          {industry.emissions_archetype}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {industry.sector}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {industry.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">CDP:</span>
                          <span className="text-xs">{industry.cdp_category}</span>
                        </div>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <span className="text-xs font-medium text-muted-foreground">GHG Protocol:</span>
                              <span className="text-xs truncate">{industry.ghg_protocol_alignment}</span>
                              <Info className="h-3 w-3 text-muted-foreground shrink-0" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{industry.ghg_protocol_alignment}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          {industry.sbti_pathway}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Grouped View */}
            <TabsContent value="grouped">
              <Accordion type="multiple" className="w-full space-y-4">
                {Object.entries(groupedData).map(([sector, industries]) => (
                  <AccordionItem key={sector} value={sector} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">{sector}</span>
                        <Badge variant="secondary">{industries.length} industries</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {industries.map((industry) => (
                          <Card key={industry.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium flex items-start justify-between gap-2">
                                {industry.industry}
                                <Badge 
                                  variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
                                  className="text-xs shrink-0"
                                >
                                  {industry.emissions_archetype}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {industry.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {industry.sbti_pathway}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Industry</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Archetype</TableHead>
                      <TableHead>CDP Category</TableHead>
                      <TableHead>SBTi Pathway</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((industry) => (
                      <TableRow key={industry.id}>
                        <TableCell className="font-medium">{industry.industry}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {industry.sector}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
                            className="text-xs"
                          >
                            {industry.emissions_archetype}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{industry.cdp_category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {industry.sbti_pathway}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-md truncate">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">{industry.description}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-sm">{industry.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-24 w-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No industries found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or clearing filters to see more results.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IndustryGlossary;