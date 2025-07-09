import { useState, useMemo } from 'react';
import { Search, Filter, Info } from 'lucide-react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

const IndustryGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  
  const { data: taxonomyData, isLoading: taxonomyLoading } = useIndustryTaxonomy();
  const { data: archetypes, isLoading: archetypesLoading } = useEmissionsArchetypes();

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    if (!taxonomyData) return [];
    const uniqueSectors = [...new Set(taxonomyData.map(item => item.sector))];
    return uniqueSectors.sort();
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
      
      return matchesSearch && matchesSector;
    });
  }, [taxonomyData, searchTerm, selectedSector]);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Industry Glossary</h1>
        <p className="text-muted-foreground text-lg">
          Explore our ESG-classified industry universe with aligned emissions archetypes, protocol mappings, and net-zero pathways.
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{taxonomyData?.length || 0} Industries Tracked</span>
          <span>{sectors.length} Sectors</span>
          <span>{filteredData.length} Results</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search industries, sectors, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="mr-2 h-4 w-4" />
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

      {/* Results */}
      <TooltipProvider>
        <div className="space-y-8">
          {Object.entries(groupedData).map(([sector, industries]) => (
            <div key={sector} className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                {sector} ({industries.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((industry) => (
                  <Card key={industry.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-medium leading-tight">
                          {industry.industry}
                        </CardTitle>
                        <Badge variant={getArchetypeBadgeVariant(industry.emissions_archetype)} className="text-xs shrink-0">
                          {industry.emissions_archetype}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {industry.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">CDP:</span>
                          <span className="text-xs text-foreground">{industry.cdp_category}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">GHG Protocol:</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-xs text-foreground">{industry.ghg_protocol_alignment}</span>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{industry.ghg_protocol_alignment}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
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
            </div>
          ))}
        </div>
      </TooltipProvider>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No industries found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default IndustryGlossary;