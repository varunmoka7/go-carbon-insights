import { useState, useMemo } from 'react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import refactored components
import { InteractiveKPIDashboard } from '@/components/industry-glossary/InteractiveKPIDashboard';
import { FilterPanel } from '@/components/industry-glossary/FilterPanel';
import { GridView } from '@/components/industry-glossary/GridView';
import { GroupedView } from '@/components/industry-glossary/GroupedView';
import { TableView } from '@/components/industry-glossary/TableView';
import { EmptyState } from '@/components/industry-glossary/EmptyState';
import { Industry } from '@/components/industry-glossary/IndustryCard';

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
          <div className="container mx-auto px-6 pt-6 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Industry Glossary</h1>
                <p className="text-sm leading-snug text-muted-foreground max-w-2xl">
                  Explore our ESG-classified industry universe with aligned emissions archetypes, protocol mappings, and net-zero pathways.
                </p>
              </div>

              {/* Interactive KPI Dashboard */}
              <InteractiveKPIDashboard 
                stats={stats} 
                taxonomyData={taxonomyData || []}
              />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          selectedArchetypes={selectedArchetypes}
          toggleArchetype={toggleArchetype}
          hotspotMode={hotspotMode}
          toggleHotspotMode={toggleHotspotMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          clearFilters={clearFilters}
          sectors={sectors}
          uniqueArchetypes={uniqueArchetypes}
          stats={stats}
          filteredCount={filteredData.length}
        />

        {/* PHASE 3: Main Content Area */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'grouped' | 'table')}>
            {/* Grid View */}
            <TabsContent value="grid" className="space-y-6">
              <GridView industries={filteredData} getArchetypeBadgeVariant={getArchetypeBadgeVariant} />
            </TabsContent>

            {/* Grouped View */}
            <TabsContent value="grouped">
              <GroupedView groupedData={groupedData} getArchetypeBadgeVariant={getArchetypeBadgeVariant} />
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table">
              <TableView industries={filteredData} getArchetypeBadgeVariant={getArchetypeBadgeVariant} />
            </TabsContent>
          </Tabs>

          {filteredData.length === 0 && (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IndustryGlossary;