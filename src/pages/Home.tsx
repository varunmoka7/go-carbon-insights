
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClimateRealityHero from '@/components/ClimateRealityHero';
import CorporateClimateMap from '@/components/CorporateClimateMap';
import SectorEmissionsDashboard from '@/components/SectorEmissionsDashboard';
import IndustryBenchmarking from '@/components/IndustryBenchmarking';
import ClimateScenarios from '@/components/ClimateScenarios';
import CollaborationHub from '@/components/CollaborationHub';

const Home = () => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <ClimateRealityHero />
      </ErrorBoundary>

      <ErrorBoundary>
        <CorporateClimateMap />
      </ErrorBoundary>

      <ErrorBoundary>
        <SectorEmissionsDashboard />
      </ErrorBoundary>

      <ErrorBoundary>
        <IndustryBenchmarking />
      </ErrorBoundary>

      <ErrorBoundary>
        <ClimateScenarios />
      </ErrorBoundary>

      <ErrorBoundary>
        <CollaborationHub />
      </ErrorBoundary>
    </div>
  );
};

export default Home;
