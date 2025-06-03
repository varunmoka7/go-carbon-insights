
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink } from 'lucide-react';
import WorldMap from './WorldMap';
import { useCorporateClimateData } from '@/hooks/useCorporateClimateData';

const CorporateClimateMap = () => {
  const { data: climateData, isLoading, error } = useCorporateClimateData();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading corporate climate data...</div>
        </div>
      </div>
    );
  }

  if (error || !climateData) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error loading climate data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            Global Corporate Climate Action
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Corporate Climate Leadership Map
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore how companies worldwide are advancing climate action through science-based targets and sustainable practices
          </p>
        </div>

        <WorldMap countries={climateData} />

        {/* Summary Statistics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {climateData.reduce((sum, country) => sum + country.sbti_companies, 0)}
            </div>
            <div className="text-sm text-gray-600">Total SBTi Companies</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(climateData.reduce((sum, country) => sum + country.reporting_quality, 0) / climateData.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Reporting Quality</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {climateData.filter(country => country.climate_leadership_score >= 85).length}
            </div>
            <div className="text-sm text-gray-600">High-Performance Countries</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              +{Math.round(climateData.reduce((sum, country) => sum + parseFloat(country.annual_improvement.replace('%', '').replace('+', '')), 0) / climateData.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Annual Improvement</div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            Data compiled from CDP Global 500 Climate Report and Science Based Targets initiative
            <a href="https://www.cdp.net/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateClimateMap;
