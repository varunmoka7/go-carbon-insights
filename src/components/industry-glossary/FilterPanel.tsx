import { Search, Eye, Grid3X3, Layers3, List, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSector: string;
  setSelectedSector: (value: string) => void;
  selectedArchetypes: string[];
  toggleArchetype: (archetype: string) => void;
  hotspotMode: boolean;
  toggleHotspotMode: () => void;
  viewMode: 'grid' | 'grouped' | 'table';
  setViewMode: (mode: 'grid' | 'grouped' | 'table') => void;
  clearFilters: () => void;
  sectors: string[];
  uniqueArchetypes: string[];
  stats: { total: number };
  filteredCount: number;
}

export const FilterPanel = ({
  searchTerm,
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  selectedArchetypes,
  toggleArchetype,
  hotspotMode,
  toggleHotspotMode,
  viewMode,
  setViewMode,
  clearFilters,
  sectors,
  uniqueArchetypes,
  stats,
  filteredCount
}: FilterPanelProps) => {
  const hasActiveFilters = searchTerm || selectedSector !== 'all' || selectedArchetypes.length > 0;

  return (
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
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Showing {filteredCount} of {stats.total} industries
          </span>
        </div>
      </div>
    </div>
  );
};