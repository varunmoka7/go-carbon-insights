
import React from 'react';
import { TrendingUp, TrendingDown, Award, Users, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BenchmarkingData {
  emissionsIntensity: number;
  industryRank: number;
  totalInSector: number;
  performanceIndicators: {
    intensityVsAvg: 'above' | 'at' | 'below';
    employeeVsAvg: 'above' | 'at' | 'below';
    efficiencyVsAvg: 'above' | 'at' | 'below';
  };
}

interface BenchmarkingSectionProps {
  benchmarkData: BenchmarkingData;
  companyName: string;
  sector: string;
}

const BenchmarkingSection = ({ benchmarkData, companyName, sector }: BenchmarkingSectionProps) => {
  const percentileRank = Math.round((1 - benchmarkData.industryRank / benchmarkData.totalInSector) * 100);
  const performanceLevel = percentileRank >= 67 ? 'excellent' : percentileRank >= 34 ? 'good' : 'needs-improvement';
  
  const getPerformanceBadge = (status: 'above' | 'at' | 'below') => {
    const config = {
      above: { text: 'Above Average', color: 'bg-green-100 text-green-800', icon: TrendingUp },
      at: { text: 'At Average', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
      below: { text: 'Below Average', color: 'bg-red-100 text-red-800', icon: TrendingDown }
    };
    
    const { text, color, icon: Icon } = config[status];
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    );
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" />
            Industry Performance Overview
          </CardTitle>
          <CardDescription>
            How {companyName} ranks among {sector} industry peers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Gauge */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">#{benchmarkData.industryRank}</div>
                <div className="text-sm text-gray-600">out of {benchmarkData.totalInSector} {sector} companies</div>
                <div className="text-lg font-semibold text-teal-600 mt-2">
                  Better than {percentileRank}% of peers
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance Level</span>
                  <span className="font-medium">
                    {performanceLevel === 'excellent' ? 'Excellent' : 
                     performanceLevel === 'good' ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={percentileRank} className="h-3" />
                  <div 
                    className={`absolute top-0 h-3 rounded ${getProgressColor(performanceLevel)}`}
                    style={{ width: `${percentileRank}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Bottom 33%</span>
                  <span>Top 33%</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Comparison */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Key Performance Indicators</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Emissions Intensity</span>
                  {getPerformanceBadge(benchmarkData.performanceIndicators.intensityVsAvg)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Per Employee Efficiency</span>
                  {getPerformanceBadge(benchmarkData.performanceIndicators.employeeVsAvg)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Facility Efficiency</span>
                  {getPerformanceBadge(benchmarkData.performanceIndicators.efficiencyVsAvg)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Comparison Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-gray-800">vs Industry Average</div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {benchmarkData.performanceIndicators.intensityVsAvg === 'above' ? '15% Better' : 
               benchmarkData.performanceIndicators.intensityVsAvg === 'below' ? '18% Higher' : 'At Average'}
            </div>
            <div className="text-xs text-gray-600">Emissions intensity comparison</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm font-semibold text-gray-800">vs Best in Class</div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round((benchmarkData.industryRank / benchmarkData.totalInSector) * 100)}% Gap
            </div>
            <div className="text-xs text-gray-600">Distance to top performer</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-gray-800">Similar Companies</div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.max(1, benchmarkData.totalInSector - benchmarkData.industryRank - 5)} - {Math.min(benchmarkData.totalInSector, benchmarkData.industryRank + 5)}
            </div>
            <div className="text-xs text-gray-600">Companies in similar range</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Performance Context</CardTitle>
          <CardDescription>Understanding your position in the {sector} sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Ranking: #{benchmarkData.industryRank} of {benchmarkData.totalInSector} {sector} companies
                </div>
                <div className="text-xs text-gray-600">
                  You're performing better than {percentileRank}% of companies in your sector
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Performance Level: {performanceLevel === 'excellent' ? 'Top Tier' : 
                                   performanceLevel === 'good' ? 'Above Average' : 'Improvement Opportunity'}
                </div>
                <div className="text-xs text-gray-600">
                  {performanceLevel === 'excellent' ? 'Leading the industry in emissions management' :
                   performanceLevel === 'good' ? 'Performing well with room for improvement' :
                   'Significant opportunities for emissions reduction'}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Next Milestone: Reach Top {Math.max(10, Math.round(percentileRank / 10) * 10)}%
                </div>
                <div className="text-xs text-gray-600">
                  Move up {Math.max(1, benchmarkData.industryRank - Math.round(benchmarkData.totalInSector * 0.1))} positions to reach next performance tier
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenchmarkingSection;
