import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FilterPanel } from './FilterPanel';
import { GridView } from './GridView';
import { GroupedView } from './GroupedView';
import { TableView } from './TableView';
import { EmptyState } from './EmptyState';

interface IndustryGlossaryContentProps {
  // Data
  filteredData: any[];
  groupedData: Record<string, any[]>;
  stats: {
    total: number;
    sectors: number;
    archetypes: number;
  };
  
  // Filter options
  sectors: string[];
  uniqueArchetypes: string[];
  
  // Filter state
  searchTerm: string;
  selectedSector: string;
  selectedArchetypes: string[];
  viewMode: 'grid' | 'grouped' | 'table';
  hotspotMode: boolean;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedSector: (sector: string) => void;
  setViewMode: (mode: 'grid' | 'grouped' | 'table') => void;
  toggleArchetype: (archetype: string) => void;
  toggleHotspotMode: () => void;
  clearFilters: () => void;
}

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

export const IndustryGlossaryContent = ({
  filteredData,
  groupedData,
  stats,
  sectors,
  uniqueArchetypes,
  searchTerm,
  selectedSector,
  selectedArchetypes,
  viewMode,
  hotspotMode,
  setSearchTerm,
  setSelectedSector,
  setViewMode,
  toggleArchetype,
  toggleHotspotMode,
  clearFilters,
}: IndustryGlossaryContentProps) => {
  return (
    <>
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

      {/* Main Content Area */}
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
    </>
  );
};