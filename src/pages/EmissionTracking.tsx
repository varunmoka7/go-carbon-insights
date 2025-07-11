import React, { useMemo } from 'react';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import sectorEmissions from '@/data/sources/sector-emissions-sources.json';

// --- Hero Section ---
const HeroSection = () => (
  <section className="bg-gradient-to-r from-green-200 to-blue-100 py-12 text-center">
    <h1 className="text-4xl font-bold mb-2">Global Sector Emissions Intelligence</h1>
    <p className="text-lg max-w-2xl mx-auto">
      Explore emissions data and decarbonization trends across major sectors and their industries. Track Scope 1, 2, and 3 emissions, benchmark sectors, and discover actionable insights for a net zero future.
    </p>
  </section>
);

// --- Sector Card ---
const SectorCard = ({ sector, isTopEmitter }: { sector: any, isTopEmitter: boolean }) => (
  <div className={`bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 ${isTopEmitter ? 'border-red-500' : 'border-blue-300'} hover:shadow-lg transition relative`}>
    {isTopEmitter && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Top Emitter</span>}
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">{sector.sector}</h3>
      <span className="text-xs px-2 py-1 rounded" style={{ background: sector.color, color: '#fff' }}>{sector.percentage}%</span>
    </div>
    <div className="text-gray-600 text-sm">Total Emissions: <span className="font-semibold">{sector.absolute}</span></div>
    <div className="flex flex-wrap gap-2 text-xs mt-2">
      {sector.subcategories?.map((sub: any) => (
        <span key={sub.name} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{sub.name}: {sub.value}</span>
      ))}
    </div>
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${sector.percentage}%`, background: sector.color }}></div>
      </div>
    </div>
    <button className="mt-2 bg-[#FFCA28] text-[#2E7D32] px-4 py-1 rounded font-semibold hover:bg-yellow-300 transition">View Details</button>
  </div>
);

// --- Scope Education Panel ---
const ScopeEducationPanel = () => (
  <section className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-green-100 rounded-xl p-6 text-center">
      <h4 className="font-bold mb-2">Scope 1</h4>
      <p>Direct emissions from owned or controlled sources (e.g., fuel combustion, process emissions).</p>
    </div>
    <div className="bg-blue-100 rounded-xl p-6 text-center">
      <h4 className="font-bold mb-2">Scope 2</h4>
      <p>Indirect emissions from the generation of purchased electricity, steam, heating, and cooling.</p>
    </div>
    <div className="bg-yellow-100 rounded-xl p-6 text-center">
      <h4 className="font-bold mb-2">Scope 3</h4>
      <p>All other indirect emissions in the value chain (e.g., supply chain, product use, waste).</p>
    </div>
  </section>
);

// --- Why Track Section ---
const WhyTrackSection = () => (
  <section className="my-12 text-center">
    <h2 className="text-2xl font-bold mb-2">Why Track Sector Emissions?</h2>
    <p className="mb-2">8 sectors = 80% of global emissions</p>
    <p className="mb-2">Benchmarking helps identify decarbonization opportunities</p>
    <p>Transparent data drives climate action and regulatory compliance</p>
  </section>
);

// --- Call to Action ---
const CallToAction = () => (
  <section className="my-12 text-center">
    <button className="bg-[#2E7D32] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#256029] transition">Explore Our Sector Database</button>
    <div className="mt-2">
      <a href="#" className="text-blue-600 underline mx-2">Request Industry Coverage</a>
      <a href="#" className="text-blue-600 underline mx-2">Contribute Data</a>
    </div>
  </section>
);

// --- Roadmap Section ---
const RoadmapSection = () => (
  <section className="my-12 text-center">
    <h2 className="text-xl font-bold mb-2">Roadmap / Coming Soon</h2>
    <p>More sectors, deeper industry breakdowns, and company-level benchmarking coming soon.</p>
  </section>
);

const EmissionTracking: React.FC = () => {
  // Fetch all taxonomy data (sectors/industries)
  const { data: taxonomyData = [] } = useIndustryTaxonomy();
  // Use the sector emissions JSON for sector-level emissions
  const sectors = sectorEmissions.sectors;
  // Sort sectors by emission percentage (descending)
  const sortedSectors = useMemo(() => [...sectors].sort((a, b) => b.percentage - a.percentage), [sectors]);
  // Top 3 emitters for badge
  const topEmitters = sortedSectors.slice(0, 3).map(s => s.sector);

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <HeroSection />
      {/* Sector Explorer */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Sector Explorer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedSectors.map(sector => (
            <SectorCard key={sector.sector} sector={sector} isTopEmitter={topEmitters.includes(sector.sector)} />
          ))}
        </div>
      </section>
      <ScopeEducationPanel />
      <WhyTrackSection />
      <CallToAction />
      <RoadmapSection />
    </div>
  );
};

export default EmissionTracking;
// ---
// This page uses sector-emissions-sources.json for sector-level emissions and taxonomy for future industry-level expansion.
// Add more detailed sector/industry breakdowns and company-level data as available. 