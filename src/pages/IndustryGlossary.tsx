import { TooltipProvider } from '@/components/ui/tooltip';
import { useIndustryGlossaryData } from '@/hooks/useIndustryGlossaryData';
import { IndustryGlossaryHeader } from '@/components/industry-glossary/IndustryGlossaryHeader';
import { IndustryGlossaryContent } from '@/components/industry-glossary/IndustryGlossaryContent';
import { IndustryGlossaryLoading } from '@/components/industry-glossary/IndustryGlossaryLoading';

const IndustryGlossary = () => {
  const {
    // Data
    taxonomyData,
    filteredData,
    groupedData,
    stats,
    
    // Loading state
    isLoading,
    
    // Filter options
    sectors,
    uniqueArchetypes,
    
    // Filter state
    searchTerm,
    selectedSector,
    selectedArchetypes,
    viewMode,
    hotspotMode,
    
    // Filter actions
    setSearchTerm,
    setSelectedSector,
    setViewMode,
    toggleArchetype,
    toggleHotspotMode,
    clearFilters,
  } = useIndustryGlossaryData();

  if (isLoading) {
    return <IndustryGlossaryLoading />;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <IndustryGlossaryHeader 
          stats={stats} 
          taxonomyData={taxonomyData || []}
        />
        
        <IndustryGlossaryContent
          filteredData={filteredData}
          groupedData={groupedData}
          stats={stats}
          sectors={sectors}
          uniqueArchetypes={uniqueArchetypes}
          searchTerm={searchTerm}
          selectedSector={selectedSector}
          selectedArchetypes={selectedArchetypes}
          viewMode={viewMode}
          hotspotMode={hotspotMode}
          setSearchTerm={setSearchTerm}
          setSelectedSector={setSelectedSector}
          setViewMode={setViewMode}
          toggleArchetype={toggleArchetype}
          toggleHotspotMode={toggleHotspotMode}
          clearFilters={clearFilters}
        />
      </div>
    </TooltipProvider>
  );
};

export default IndustryGlossary;