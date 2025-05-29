
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { companies, getCompanyById, getCompanyRankings } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, Building2 } from 'lucide-react';

const Decarbonization = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [activeView, setActiveView] = useState<'strategy' | 'performance' | 'comparison' | 'sectors'>('strategy');

  const company = getCompanyById(selectedCompany);
  const rankings = getCompanyRankings();

  if (!company) {
    return <div>Company not found</div>;
  }

  // Enhanced waterfall data with better formatting
  const waterfallData = [
    { name: '2019 Baseline', value: 4400, cumulative: 4400, type: 'baseline' },
    { name: 'Renewable Energy', value: -350, cumulative: 4050, type: 'reduction' },
    { name: 'Energy Efficiency', value: -200, cumulative: 3850, type: 'reduction' },
    { name: 'Sustainable Procurement', value: -600, cumulative: 3250, type: 'reduction' },
    { name: 'Process Innovation', value: -300, cumulative: 2950, type: 'reduction' },
    { name: 'Other Levers', value: -150, cumulative: 2800, type: 'reduction' },
    { name: '2030 Target', value: 0, cumulative: 2200, type: 'target' }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getBarColor = (item: any) => {
    if (item.type === 'baseline') return '#6b7280';
    if (item.type === 'target') return '#3b82f6';
    return item.value < 0 ? '#10b981' : '#ef4444';
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
              {companies.map((comp) => (
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

          {/* Carbon Levers Strategy */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Climate Strategy Levers</h2>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={company.decarbonizationStrategy.carbonLevers} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="lever" 
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
                  label={{ value: 'Reduction (tCO2e)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  formatter={(value, name) => [`${value} tCO2e`, 'Reduction']}
                />
                <Bar 
                  dataKey="reduction" 
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon Levers Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Carbon Reduction Initiatives</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Lever</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Reduction (tCO2e)</TableHead>
                    <TableHead className="font-semibold">% of Total</TableHead>
                    <TableHead className="font-semibold">Implementation</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.decarbonizationStrategy.carbonLevers.map((lever, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{lever.lever}</TableCell>
                      <TableCell>
                        <Badge variant={lever.category === 'scope1and2' ? 'default' : 'secondary'}>
                          {lever.category === 'scope1and2' ? 'Scope 1 & 2' : 'Scope 3'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{lever.reduction.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{lever.percentage}%</TableCell>
                      <TableCell className="max-w-xs text-sm">{lever.implementation}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lever.status)}>
                          {lever.status.charAt(0).toUpperCase() + lever.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h2>
            <div className="space-y-4">
              {company.decarbonizationStrategy.achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-teal-500 pl-6 py-4 bg-teal-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{achievement.initiative}</h3>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="font-semibold">{achievement.year}</Badge>
                      <span className="text-sm font-bold text-teal-600">
                        -{achievement.reduction} tCO2e
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                </div>
              ))}
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
                    <span className="text-sm font-bold">{company.sbtiTargets.currentProgress.scope1And2Achieved}% / {company.sbtiTargets.nearTerm2030.scope1And2Reduction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${(company.sbtiTargets.currentProgress.scope1And2Achieved / company.sbtiTargets.nearTerm2030.scope1And2Reduction) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">Scope 3 Reduction</span>
                    <span className="text-sm font-bold">{company.sbtiTargets.currentProgress.scope3Achieved}% / {company.sbtiTargets.nearTerm2030.scope3Reduction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${(company.sbtiTargets.currentProgress.scope3Achieved / company.sbtiTargets.nearTerm2030.scope3Reduction) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-3">
                  <Badge className={company.sbtiTargets.currentProgress.onTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {company.sbtiTargets.currentProgress.onTrack ? 'On Track' : 'Behind Target'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SBTI Long-term Targets (2050)</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Net Zero Commitment</span>
                  <Badge className={company.sbtiTargets.longTerm2050.netZeroTarget ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {company.sbtiTargets.longTerm2050.netZeroTarget ? 'Committed' : 'Not Committed'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Total Reduction Target</span>
                  <span className="text-sm font-bold">{company.sbtiTargets.longTerm2050.totalReduction}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Target Year</span>
                  <span className="text-sm font-bold">{company.sbtiTargets.longTerm2050.targetYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emissions Reduction Waterfall - Improved */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emissions Reduction Pathway to 2030</h2>
            <div className="w-full max-w-5xl mx-auto">
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
                    fill={(entry) => getBarColor(entry)}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeView === 'comparison' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company SBTI Performance Comparison</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Rank</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Sector</TableHead>
                  <TableHead className="font-semibold">Scope 1 & 2 Progress</TableHead>
                  <TableHead className="font-semibold">Scope 3 Progress</TableHead>
                  <TableHead className="font-semibold">Overall Progress</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((company, index) => (
                  <TableRow key={company.id} className={company.id === selectedCompany ? 'bg-teal-50' : ''}>
                    <TableCell className="font-bold">#{index + 1}</TableCell>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-sm">{company.sector}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${company.scope1And2Progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{company.scope1And2Progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${company.scope3Progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{company.scope3Progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {company.overallProgress.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={company.onTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {company.onTrack ? 'On Track' : 'Behind'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
