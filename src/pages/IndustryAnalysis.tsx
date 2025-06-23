
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  TrendingUp, 
  Users, 
  Globe, 
  ChevronRight, 
  Filter,
  Play,
  Clock,
  Calendar,
  Factory,
  Zap,
  Truck,
  TreePine,
  Recycle,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  sectorsData, 
  industryGlobalStats, 
  developmentRoadmap,
  frameworkAlignment,
  userEngagementMetrics
} from '@/data/industryAnalysisData';

const IndustryAnalysis = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'coming-soon' | 'planned'>('all');

  const filteredSectors = sectorsData.filter(sector => 
    filterStatus === 'all' || sector.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="h-4 w-4 text-green-600" />;
      case 'coming-soon': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'planned': return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'coming-soon': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSectorIcon = (sectorId: string) => {
    switch (sectorId) {
      case 'plastic-packaging': return Factory;
      case 'methane-emissions': return Zap;
      case 'renewable-energy': return TreePine;
      case 'agriculture-land-use': return TreePine;
      case 'transportation-logistics': return Truck;
      case 'built-environment': return Building;
      default: return Factory;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Industry-Specific Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Deep-dive into sector-specific environmental impacts and benchmark leading companies 
            across entire value chains using science-based metrics
          </p>
        </div>

        {/* Global Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {industryGlobalStats.globalGHGEmissions}
            </div>
            <div className="text-sm font-medium text-red-700 dark:text-red-300">
              Global GHG Emissions
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              {industryGlobalStats.keyIndustryContributors}
            </div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Key Industry Contributors
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-xl border border-teal-200 dark:border-teal-800">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {industryGlobalStats.companiesTracked}
            </div>
            <div className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Companies Tracked
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {industryGlobalStats.sectorCoverage}
            </div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Sector Coverage
            </div>
          </div>
        </div>
      </div>

      {/* Sector Filtering */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          All Sectors
        </Button>
        <Button
          variant={filterStatus === 'live' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('live')}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Live Analysis
        </Button>
        <Button
          variant={filterStatus === 'coming-soon' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('coming-soon')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Coming Soon
        </Button>
        <Button
          variant={filterStatus === 'planned' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('planned')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Planned
        </Button>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSectors.map((sector) => {
          const SectorIcon = getSectorIcon(sector.id);
          const isClickable = sector.status === 'live';
          
          const CardComponent = isClickable ? Link : 'div';
          const cardProps = isClickable ? { to: sector.route! } : {};

          return (
            <CardComponent key={sector.id} {...cardProps}>
              <Card className={`h-full transition-all duration-300 ${
                isClickable 
                  ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
                  : 'cursor-default'
              }`}>
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg flex items-center justify-center">
                        <SectorIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <Badge className={`${getStatusColor(sector.status)} border flex items-center gap-1`}>
                          {getStatusIcon(sector.status)}
                          {sector.statusBadge}
                        </Badge>
                      </div>
                    </div>
                    {isClickable && <ChevronRight className="h-5 w-5 text-gray-400" />}
                  </div>
                  
                  <div>
                    <CardTitle className="text-lg mb-2">{sector.title}</CardTitle>
                    <CardDescription>{sector.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Impact</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{sector.impact}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Key Challenge</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{sector.keyChallenge}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Companies Tracked</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{sector.companiesTracked}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Primary Metrics</div>
                    <div className="flex flex-wrap gap-1">
                      {sector.primaryMetrics.slice(0, 3).map((metric, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                      {sector.primaryMetrics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{sector.primaryMetrics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardComponent>
          );
        })}
      </div>

      {/* Development Roadmap Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Development Roadmap
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track our progress in expanding sector coverage and building comprehensive 
            industry analysis capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {developmentRoadmap.liveSectors}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Live Sectors
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              {developmentRoadmap.inDevelopment}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              In Development
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {developmentRoadmap.planned}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Planned Sectors
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Target className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium">
              Next Release: {developmentRoadmap.nextRelease}
            </span>
          </div>
        </div>
      </div>

      {/* Framework Alignment Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Methodology & Standards Alignment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworkAlignment.map((framework, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{framework.name}</CardTitle>
                <CardDescription>{framework.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryAnalysis;
