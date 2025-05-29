
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { enhancedCompanies, getCompanyById } from '@/data/enhancedMockData';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, Building2 } from 'lucide-react';

const Decarbonization = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [activeView, setActiveView] = useState<'strategy' | 'performance' | 'comparison' | 'sectors'>('strategy');

  const company = getCompanyById(selectedCompany);

  if (!company) {
    return <div>Company not found</div>;
  }

  // Enhanced waterfall data with colors included
  const waterfallData = [
    { name: '2019 Baseline', value: 4400, cumulative: 4400, type: 'baseline', color: '#6b7280' },
    { name: 'Renewable Energy', value: -350, cumulative: 4050, type: 'reduction', color: '#10b981' },
    { name: 'Energy Efficiency', value: -200, cumulative: 3850, type: 'reduction', color: '#10b981' },
    { name: 'Sustainable Procurement', value: -600, cumulative: 3250, type: 'reduction', color: '#10b981' },
    { name: 'Process Innovation', value: -300, cumulative: 2950, type: 'reduction', color: '#10b981' },
    { name: 'Other Levers', value: -150, cumulative: 2800, type: 'reduction', color: '#10b981' },
    { name: '2030 Target', value: 0, cumulative: 2200, type: 'target', color: '#3b82f6' }
  ];

  // Mock sector analysis data representing ~3,000 companies
  const expandedSectorAnalysis = [
    {
      sector: 'Technology',
      companies: 520,
      avgReduction: '18.5%',
      topPerformer: 'TechCorp Industries',
      marketCap: '$2.1T',
      avgEmissions: '125k tCO2e',
      trend: 'improving'
    },
    {
      sector: 'Manufacturing',
      companies: 680,
      avgReduction: '14.2%',
      topPerformer: 'Green Manufacturing Co.',
      marketCap: '$1.8T',
      avgEmissions: '89k tCO2e',
      trend: 'improving'
    },
    {
      sector: 'Retail & Consumer',
      companies: 420,
      avgReduction: '12.8%',
      topPerformer: 'Retail Giant',
      marketCap: '$950B',
      avgEmissions: '156k tCO2e',
      trend: 'stable'
    },
    {
      sector: 'Energy & Utilities',
      companies: 340,
      avgReduction: '22.3%',
      topPerformer: 'Clean Energy Corp',
      marketCap: '$1.2T',
      avgEmissions: '380k tCO2e',
      trend: 'improving'
    },
    {
      sector: 'Financial Services',
      companies: 290,
      avgReduction: '16.7%',
      topPerformer: 'Green Bank Holdings',
      marketCap: '$890B',
      avgEmissions: '45k tCO2e',
      trend: 'improving'
    },
    {
      sector: 'Healthcare',
      companies: 180,
      avgReduction: '11.4%',
      topPerformer: 'MedTech Solutions',
      marketCap: '$720B',
      avgEmissions: '78k tCO2e',
      trend: 'stable'
    },
    {
      sector: 'Transportation',
      companies: 220,
      avgReduction: '8.9%',
      topPerformer: 'EcoTransport Inc',
      marketCap: '$540B',
      avgEmissions: '290k tCO2e',
      trend: 'declining'
    },
    {
      sector: 'Real Estate',
      companies: 160,
      avgReduction: '13.6%',
      topPerformer: 'Sustainable Properties',
      marketCap: '$380B',
      avgEmissions: '112k tCO2e',
      trend: 'stable'
    },
    {
      sector: 'Agriculture & Food',
      companies: 140,
      avgReduction: '9.2%',
      topPerformer: 'Farm Fresh Corp',
      marketCap: '$290B',
      avgEmissions: '180k tCO2e',
      trend: 'declining'
    },
    {
      sector: 'Materials & Mining',
      companies: 110,
      avgReduction: '7.8%',
      topPerformer: 'Green Materials Ltd',
      marketCap: '$450B',
      avgEmissions: '520k tCO2e',
      trend: 'declining'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Decarbonization Strategy</h1>
        <p className="text-lg text-gray-600 mb-6">Carbon reduction pathways and performance analysis across industries</p>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4 mt-6">
          <label className="text-sm font-semibold text-gray-700">Select Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {enhancedCompanies.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2 mt-6">
          <Button
            variant={activeView === 'strategy' ? 'default' : 'outline'}
            onClick={() => setActiveView('strategy')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Carbon Strategy
          </Button>
          <Button
            variant={activeView === 'performance' ? 'default' : 'outline'}
            onClick={() => setActiveView('performance')}
          >
            SBTI Performance
          </Button>
          <Button
            variant={activeView === 'comparison' ? 'default' : 'outline'}
            onClick={() => setActiveView('comparison')}
          >
            Company Comparison
          </Button>
          <Button
            variant={activeView === 'sectors' ? 'default' : 'outline'}
            onClick={() => setActiveView('sectors')}
          >
            Sector Analysis
          </Button>
        </div>
      </div>

      {activeView === 'strategy' && (
        <>
          {/* Mockup Data Warning */}
          <Alert className="mb-8 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              <strong>Mockup Data Warning:</strong> The carbon strategy data displayed below represents simulated information for demonstration purposes. Real company-specific decarbonization strategies will be integrated upon data availability.
            </AlertDescription>
          </Alert>

          {/* Coming Soon Placeholder for companies without data */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Climate Strategy Overview</h2>
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
                <p className="text-gray-500 leading-relaxed">
                  Detailed carbon strategy data for {company.name} is currently being compiled. 
                  This section will include comprehensive decarbonization pathways, carbon levers analysis, 
                  and implementation timelines once the data integration is complete.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'performance' && (
        <>
          {/* SBTI Progress */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SBTI Near-term Targets (2030)</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">Scope 1 & 2 Reduction</span>
                    <span className="text-sm font-bold">42% / 50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: '84%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">Scope 3 Reduction</span>
                    <span className="text-sm font-bold">18% / 25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: '72%' }}
                    ></div>
                  </div>
                </div>
                <div className="pt-3">
                  <Badge className="bg-green-100 text-green-800">
                    On Track
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SBTI Long-term Targets (2050)</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Net Zero Commitment</span>
                  <Badge className="bg-green-100 text-green-800">
                    Committed
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Total Reduction Target</span>
                  <span className="text-sm font-bold">90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Target Year</span>
                  <span className="text-sm font-bold">2050</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emissions Reduction Waterfall - Fixed */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emissions Reduction Pathway to 2030</h2>
            <div className="w-full max-w-4xl mx-auto">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={500}
                    label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value) => [`${Math.abs(Number(value))} tCO2e`, Number(value) < 0 ? 'Reduction' : 'Emissions']}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeView === 'comparison' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company SBTI Performance Comparison</h2>
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-500 leading-relaxed">
                Company comparison data is being prepared. This section will provide comprehensive 
                SBTI performance rankings and benchmarking across industry peers.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'sectors' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Global Sector Analysis</h2>
                <p className="text-gray-600 mt-2">Comprehensive analysis across {expandedSectorAnalysis.reduce((acc, sector) => acc + sector.companies, 0).toLocaleString()} companies worldwide</p>
              </div>
              <Building2 className="h-8 w-8 text-teal-600" />
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Sector</TableHead>
                    <TableHead className="font-semibold">Companies</TableHead>
                    <TableHead className="font-semibold">Avg. Reduction</TableHead>
                    <TableHead className="font-semibold">Top Performer</TableHead>
                    <TableHead className="font-semibold">Market Cap</TableHead>
                    <TableHead className="font-semibold">Avg. Emissions</TableHead>
                    <TableHead className="font-semibold">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expandedSectorAnalysis.map((sector, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-bold text-gray-900">{sector.sector}</TableCell>
                      <TableCell className="font-medium">{sector.companies}</TableCell>
                      <TableCell className="font-medium text-green-600">{sector.avgReduction}</TableCell>
                      <TableCell className="text-sm">{sector.topPerformer}</TableCell>
                      <TableCell className="font-medium">{sector.marketCap}</TableCell>
                      <TableCell className="text-sm">{sector.avgEmissions}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(sector.trend)}
                          <span className={`text-sm font-medium ${
                            sector.trend === 'improving' ? 'text-green-600' : 
                            sector.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {sector.trend.charAt(0).toUpperCase() + sector.trend.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decarbonization;
