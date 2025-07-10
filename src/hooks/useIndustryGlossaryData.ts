import { useState, useMemo } from 'react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';

export const useIndustryGlossaryData = () => {
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

  // Filter actions
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedArchetypes([]);
    setSelectedPathways([]);
    setHotspotMode(false);
  };

  const toggleArchetype = (archetype: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(archetype) 
        ? prev.filter(a => a !== archetype)
        : [...prev, archetype]
    );
  };

  const togglePathway = (pathway: string) => {
    setSelectedPathways(prev => 
      prev.includes(pathway) 
        ? prev.filter(p => p !== pathway)
        : [...prev, pathway]
    );
  };

  const hotspotArchetypes = ['Operational Emitter', 'Upstream-heavy'];
  const toggleHotspotMode = () => {
    setHotspotMode(!hotspotMode);
    if (!hotspotMode) {
      setSelectedArchetypes(hotspotArchetypes);
    } else {
      setSelectedArchetypes([]);
    }
  };

  return {
    // Data
    taxonomyData,
    filteredData,
    groupedData,
    stats,
    
    // Loading states
    isLoading: taxonomyLoading || archetypesLoading,
    
    // Filter options
    sectors,
    uniqueArchetypes,
    uniquePathways,
    
    // Filter state
    searchTerm,
    selectedSector,
    selectedArchetypes,
    selectedPathways,
    viewMode,
    hotspotMode,
    
    // Filter actions
    setSearchTerm,
    setSelectedSector,
    setViewMode,
    toggleArchetype,
    togglePathway,
    toggleHotspotMode,
    clearFilters,
  };
};