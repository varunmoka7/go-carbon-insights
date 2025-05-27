
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { companies, getCompanyById, getCompanyRankings } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Decarbonization = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [activeView, setActiveView] = useState<'strategy' | 'performance' | 'comparison'>('strategy');

  const company = getCompanyById(selectedCompany);
  const rankings = getCompanyRankings();

  if (!company) {
    return <div>Company not found</div>;
  }

  const waterfallData = [
    { name: '2019 Baseline', value: 4400, cumulative: 4400 },
    { name: 'Renewable Energy', value: -350, cumulative: 4050 },
    { name: 'Energy Efficiency', value: -200, cumulative: 3850 },
    { name: 'Sustainable Procurement', value: -600, cumulative: 3250 },
    { name: 'Process Innovation', value: -300, cumulative: 2950 },
    { name: 'Other Levers', value: -150, cumulative: 2800 },
    { name: '2030 Target', value: 0, cumulative: 2200 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Decarbonization Strategy</h1>
        <p className="text-gray-600">Carbon reduction pathways and performance analysis</p>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4 mt-6">
          <label className="text-sm font-medium text-gray-700">Select Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
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
        </div>
      </div>

      {activeView === 'strategy' && (
        <>
          {/* Carbon Levers Strategy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Climate Strategy Levers</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={company.decarbonizationStrategy.carbonLevers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="lever" 
                  stroke="#6b7280" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" label={{ value: 'Reduction (tCO2e)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [`${value} tCO2e`, 'Reduction']}
                />
                <Bar 
                  dataKey="reduction" 
                  fill={(entry) => entry.category === 'scope1and2' ? '#0d9488' : '#0891b2'}
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon Levers Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Carbon Reduction Initiatives</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lever</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reduction (tCO2e)</TableHead>
                    <TableHead>% of Total</TableHead>
                    <TableHead>Implementation</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>{lever.reduction.toLocaleString()}</TableCell>
                      <TableCell>{lever.percentage}%</TableCell>
                      <TableCell className="max-w-xs">{lever.implementation}</TableCell>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Achievements</h2>
            <div className="space-y-4">
              {company.decarbonizationStrategy.achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-teal-500 pl-4 py-3 bg-teal-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{achievement.initiative}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{achievement.year}</Badge>
                      <span className="text-sm font-medium text-teal-600">
                        -{achievement.reduction} tCO2e
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{achievement.description}</p>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SBTI Near-term Targets (2030)</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Scope 1 & 2 Reduction</span>
                    <span className="text-sm font-medium">{company.sbtiTargets.currentProgress.scope1And2Achieved}% / {company.sbtiTargets.nearTerm2030.scope1And2Reduction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${(company.sbtiTargets.currentProgress.scope1And2Achieved / company.sbtiTargets.nearTerm2030.scope1And2Reduction) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Scope 3 Reduction</span>
                    <span className="text-sm font-medium">{company.sbtiTargets.currentProgress.scope3Achieved}% / {company.sbtiTargets.nearTerm2030.scope3Reduction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(company.sbtiTargets.currentProgress.scope3Achieved / company.sbtiTargets.nearTerm2030.scope3Reduction) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2">
                  <Badge className={company.sbtiTargets.currentProgress.onTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {company.sbtiTargets.currentProgress.onTrack ? 'On Track' : 'Behind Target'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SBTI Long-term Targets (2050)</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Net Zero Commitment</span>
                  <Badge className={company.sbtiTargets.longTerm2050.netZeroTarget ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {company.sbtiTargets.longTerm2050.netZeroTarget ? 'Committed' : 'Not Committed'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Reduction Target</span>
                  <span className="text-sm font-medium">{company.sbtiTargets.longTerm2050.totalReduction}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Target Year</span>
                  <span className="text-sm font-medium">{company.sbtiTargets.longTerm2050.targetYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emissions Reduction Waterfall */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions Reduction Pathway to 2030</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${Math.abs(value)} tCO2e`, value < 0 ? 'Reduction' : 'Emissions']}
                />
                <Bar 
                  dataKey="value" 
                  fill={(entry, index) => {
                    if (entry.name === '2019 Baseline' || entry.name === '2030 Target') return '#6b7280';
                    return entry.value < 0 ? '#0d9488' : '#ef4444';
                  }}
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeView === 'comparison' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Company SBTI Performance Comparison</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Scope 1 & 2 Progress</TableHead>
                  <TableHead>Scope 3 Progress</TableHead>
                  <TableHead>Overall Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((company, index) => (
                  <TableRow key={company.id} className={company.id === selectedCompany ? 'bg-teal-50' : ''}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.sector}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${company.scope1And2Progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{company.scope1And2Progress}%</span>
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
                        <span className="text-sm">{company.scope3Progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
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
    </div>
  );
};

export default Decarbonization;
