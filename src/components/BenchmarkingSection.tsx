
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  // Sample peer comparison data
  const peerComparisonData = [
    { metric: 'Emissions Intensity', company: benchmarkData.emissionsIntensity, industryAvg: benchmarkData.emissionsIntensity * 1.15, industryBest: benchmarkData.emissionsIntensity * 0.7 },
    { metric: 'Per Employee', company: 5.2, industryAvg: 6.8, industryBest: 3.1 },
    { metric: 'Facility Efficiency', company: 0.85, industryAvg: 1.2, industryBest: 0.6 },
    { metric: 'Annual Reduction', company: 8.5, industryAvg: 6.2, industryBest: 12.3 }
  ];

  // Sample ranking distribution
  const rankingData = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10 + 1}-${(i + 1) * 10}`,
    companies: i === Math.floor(benchmarkData.industryRank / benchmarkData.totalInSector * 10) ? 
      benchmarkData.industryRank % 10 || 10 : Math.floor(Math.random() * 8) + 3,
    isCompany: i === Math.floor(benchmarkData.industryRank / benchmarkData.totalInSector * 10)
  }));

  const getPerformanceBadge = (status: 'above' | 'at' | 'below') => {
    const config = {
      above: { text: 'Above Average', color: 'bg-green-100 text-green-800' },
      at: { text: 'At Average', color: 'bg-yellow-100 text-yellow-800' },
      below: { text: 'Below Average', color: 'bg-red-100 text-red-800' }
    };
    
    return <Badge className={config[status].color}>{config[status].text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Sector Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Sector Performance Overview</CardTitle>
          <CardDescription>
            How {companyName} compares to {sector} industry peers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">#{benchmarkData.industryRank}</div>
              <div className="text-sm text-gray-600">of {benchmarkData.totalInSector} companies</div>
              <div className="text-xs text-gray-500 mt-1">Industry Ranking</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Emissions Intensity</span>
                {getPerformanceBadge(benchmarkData.performanceIndicators.intensityVsAvg)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Per Employee</span>
                {getPerformanceBadge(benchmarkData.performanceIndicators.employeeVsAvg)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Facility Efficiency</span>
                {getPerformanceBadge(benchmarkData.performanceIndicators.efficiencyVsAvg)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-lg font-bold text-teal-700">
                {Math.round((1 - benchmarkData.industryRank / benchmarkData.totalInSector) * 100)}%
              </div>
              <div className="text-sm text-teal-600">Better than peers</div>
              <div className="text-xs text-teal-500 mt-1">Performance Percentile</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peer Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Peer Comparison</CardTitle>
          <CardDescription>Performance vs industry average and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="metric" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => {
                  const labels = {
                    company: companyName,
                    industryAvg: 'Industry Average',
                    industryBest: 'Industry Best'
                  };
                  return [value, labels[name as keyof typeof labels] || name];
                }}
              />
              <Bar dataKey="company" fill="#0d9488" name="company" />
              <Bar dataKey="industryAvg" fill="#94a3b8" name="industryAvg" />
              <Bar dataKey="industryBest" fill="#059669" name="industryBest" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Industry Ranking Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Industry Ranking Distribution</CardTitle>
          <CardDescription>Where your company stands among {sector} sector peers</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rankingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" fontSize={12} />
              <YAxis label={{ value: 'Companies', angle: -90, position: 'insideLeft' }} fontSize={12} />
              <Tooltip />
              <Bar 
                dataKey="companies" 
                fill={(entry) => entry.isCompany ? "#dc2626" : "#94a3b8"}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>Your Company</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>Industry Peers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenchmarkingSection;
