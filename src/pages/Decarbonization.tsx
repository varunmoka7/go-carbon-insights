
import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Target, TrendingDown, Leaf, Building, Users, BarChart3, Globe, Factory, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enhancedCompanies, getCompanyById } from '@/data/enhancedMockData';

const Decarbonization = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  
  const company = getCompanyById(selectedCompany);
  if (!company) return <div>Company not found</div>;

  // Get companies from all sectors for comparison
  const comparisonCompanies = enhancedCompanies
    .filter(comp => comp.id !== selectedCompany)
    .slice(0, 8)
    .map(comp => ({
      name: comp.name,
      sector: comp.sector,
      industry: comp.industry,
      totalEmissions: comp.totalEmissions,
      renewableEnergy: comp.renewableEnergyPercentage,
      sbtiProgress: comp.sbtiProgress || 0,
      carbonCredits: comp.carbonCredits || 0,
      materialityScore: comp.materialityScore || 0
    }));

  // Add selected company to comparison
  const allCompanies = [
    {
      name: company.name,
      sector: company.sector,
      industry: company.industry,
      totalEmissions: company.totalEmissions,
      renewableEnergy: company.renewableEnergyPercentage,
      sbtiProgress: company.sbtiProgress || 0,
      carbonCredits: company.carbonCredits || 0,
      materialityScore: company.materialityScore || 0,
      isSelected: true
    },
    ...comparisonCompanies.map(comp => ({ ...comp, isSelected: false }))
  ];

  const pathwayData = [
    { name: '2024', emissions: 120000 },
    { name: '2025', emissions: 110000 },
    { name: '2026', emissions: 100000 },
    { name: '2027', emissions: 90000 },
    { name: '2028', emissions: 80000 },
    { name: '2029', emissions: 70000 },
    { name: '2030', emissions: 60000 }
  ];

  const sectorData = [
    { sector: 'Technology', progress: 75, companies: 6, avgEmissions: 73000 },
    { sector: 'Manufacturing', progress: 60, companies: 6, avgEmissions: 225000 },
    { sector: 'Transportation', progress: 45, companies: 6, avgEmissions: 440000 },
    { sector: 'Mining', progress: 48, companies: 6, avgEmissions: 385000 },
    { sector: 'FMCG', progress: 68, companies: 6, avgEmissions: 215000 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Decarbonization Strategy</h1>
        <p className="text-lg text-gray-600 mb-6">Strategic pathways and industry benchmarking</p>

        {/* Company Selection */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-gray-800">Select Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-72 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {enhancedCompanies.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{comp.name}</span>
                    <span className="text-xs text-gray-500">{comp.sector}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="sbti" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sbti" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>SBTi Strategy</span>
          </TabsTrigger>
          <TabsTrigger value="carbon" className="flex items-center space-x-2">
            <Leaf className="h-4 w-4" />
            <span>Carbon Strategy</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Company Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="sector" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Sector Analysis</span>
          </TabsTrigger>
        </TabsList>

        {/* SBTi Strategy Tab */}
        <TabsContent value="sbti" className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Science-Based Targets Initiative (SBTi)</CardTitle>
                  <CardDescription className="text-gray-600">
                    Decarbonization pathway aligned with climate science
                  </CardDescription>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pathwayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emissions" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SBTi Company Details */}
          {company.sbtiTargets && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Current SBTi Commitments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{company.sbtiTargets.description}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="text-sm font-semibold">Near-term Target:</span>
                      <span className="text-sm text-blue-700 font-medium">{company.sbtiTargets.nearTermTarget}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="text-sm font-semibold">Long-term Target:</span>
                      <span className="text-sm text-blue-700 font-medium">{company.sbtiTargets.longTermTarget}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="text-sm font-semibold">Baseline Year:</span>
                      <span className="text-sm text-blue-700 font-medium">{company.sbtiTargets.baselineYear}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Carbon Strategy Tab */}
        <TabsContent value="carbon" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Carbon Strategy Portfolio</CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive carbon management and strategic initiatives for {company.name}
              </CardDescription>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Mockup Data Warning:</strong> The carbon strategy data shown is simulated for demonstration purposes.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Company Profile */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      Company Profile
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Total Emissions:</span>
                        <span className="font-bold text-lg">{(company.totalEmissions / 1000).toFixed(1)}K tCO2e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Scope 1:</span>
                        <span className="font-semibold">{(company.emissionsData[5]?.scope1 / 1000).toFixed(1)}K tCO2e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Scope 2:</span>
                        <span className="font-semibold">{(company.emissionsData[5]?.scope2 / 1000).toFixed(1)}K tCO2e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Scope 3:</span>
                        <span className="font-semibold">{(company.emissionsData[5]?.scope3 / 1000).toFixed(1)}K tCO2e</span>
                      </div>
                    </div>
                  </div>

                  {/* Carbon Credits */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-600" />
                      Carbon Credits Portfolio
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Total Credits:</span>
                        <span className="font-bold text-lg text-green-700">{company.carbonCredits?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Verified Credits:</span>
                        <span className="font-semibold">{Math.round((company.carbonCredits || 0) * 0.85).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Pending Verification:</span>
                        <span className="font-semibold">{Math.round((company.carbonCredits || 0) * 0.15).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Double Materiality & Value Chain */}
                <div className="space-y-6">
                  {/* Double Materiality Assessment */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Double Materiality Assessment
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Materiality Score:</span>
                        <span className="font-bold text-lg text-purple-700">{company.materialityScore || 'N/A'}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Financial Impact:</span>
                        <span className="font-semibold">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Environmental Impact:</span>
                        <span className="font-semibold">Significant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Stakeholder Priority:</span>
                        <span className="font-semibold">Critical</span>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Decarbonization */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-orange-600" />
                      Supplier Decarbonization
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Progress:</span>
                        <span className="font-bold text-lg text-orange-700">{company.supplierDecarbonization || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Engaged Suppliers:</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">SBTi Committed:</span>
                        <span className="font-semibold">42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Scope 3 Reduction:</span>
                        <span className="font-semibold">18%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Chain Carbon Footprint Tracking */}
              <div className="mt-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-teal-600" />
                  Value Chain Carbon Footprint Tracking
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">
                      {((company.emissionsData[5]?.scope3 || 0) * 0.45 / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Upstream Emissions (tCO2e)</div>
                    <div className="text-xs text-gray-500 mt-1">Purchased goods & services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">
                      {((company.emissionsData[5]?.scope1 + company.emissionsData[5]?.scope2) / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Direct Operations (tCO2e)</div>
                    <div className="text-xs text-gray-500 mt-1">Scope 1 & 2 emissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">
                      {((company.emissionsData[5]?.scope3 || 0) * 0.55 / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Downstream Emissions (tCO2e)</div>
                    <div className="text-xs text-gray-500 mt-1">Use of sold products</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Comparison Tab */}
        <TabsContent value="comparison" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Multi-Sector Company Comparison</CardTitle>
              <CardDescription className="text-gray-600">
                Compare {company.name} with leading companies across different sectors and industries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Company</TableHead>
                      <TableHead className="font-semibold">Sector</TableHead>
                      <TableHead className="font-semibold">Industry</TableHead>
                      <TableHead className="font-semibold text-right">Total Emissions (tCO2e)</TableHead>
                      <TableHead className="font-semibold text-right">Renewable Energy (%)</TableHead>
                      <TableHead className="font-semibold text-right">SBTi Progress (%)</TableHead>
                      <TableHead className="font-semibold text-right">Carbon Credits</TableHead>
                      <TableHead className="font-semibold text-right">Materiality Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCompanies.map((comp, index) => (
                      <TableRow 
                        key={index} 
                        className={comp.isSelected ? "bg-teal-50 border-l-4 border-l-teal-500" : ""}
                      >
                        <TableCell className={`font-medium ${comp.isSelected ? "text-teal-700" : ""}`}>
                          {comp.name} {comp.isSelected && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded ml-2">Selected</span>}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{comp.sector}</TableCell>
                        <TableCell className="text-sm text-gray-600">{comp.industry}</TableCell>
                        <TableCell className="text-right font-mono">{comp.totalEmissions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            comp.renewableEnergy >= 70 ? 'bg-green-100 text-green-700' :
                            comp.renewableEnergy >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {comp.renewableEnergy}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            comp.sbtiProgress >= 80 ? 'bg-green-100 text-green-700' :
                            comp.sbtiProgress >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {comp.sbtiProgress}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">{comp.carbonCredits.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            comp.materialityScore >= 8 ? 'bg-green-100 text-green-700' :
                            comp.materialityScore >= 6 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {comp.materialityScore}/10
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sector Analysis Tab */}
        <TabsContent value="sector" className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Global Sector Analysis</CardTitle>
                  <CardDescription className="text-gray-600">
                    Industry-wide decarbonization progress and benchmarking across 5 sectors
                  </CardDescription>
                </div>
              </div>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Mock Data Warning:</strong> The sector analysis data displayed below is simulated for demonstration purposes and does not represent actual market data.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Sector Progress Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#82ca9d" name="Decarbonization Progress (%)" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Detailed Sector Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Sector</TableHead>
                        <TableHead className="font-semibold text-right">Companies Analyzed</TableHead>
                        <TableHead className="font-semibold text-right">Avg. Emissions (tCO2e)</TableHead>
                        <TableHead className="font-semibold text-right">Decarbonization Progress (%)</TableHead>
                        <TableHead className="font-semibold">Key Challenges</TableHead>
                        <TableHead className="font-semibold">Leading Practices</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectorData.map((sector, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{sector.sector}</TableCell>
                          <TableCell className="text-right">{sector.companies}</TableCell>
                          <TableCell className="text-right font-mono">{sector.avgEmissions.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              sector.progress >= 70 ? 'bg-green-100 text-green-700' :
                              sector.progress >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {sector.progress}%
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {sector.sector === 'Technology' && 'Data center energy, supply chain complexity'}
                            {sector.sector === 'Manufacturing' && 'Process emissions, energy intensity'}
                            {sector.sector === 'Transportation' && 'Fuel dependency, infrastructure transition'}
                            {sector.sector === 'Mining' && 'Heavy machinery, remote operations'}
                            {sector.sector === 'FMCG' && 'Supply chain scope, packaging waste'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {sector.sector === 'Technology' && 'Renewable energy adoption, cloud efficiency'}
                            {sector.sector === 'Manufacturing' && 'Process optimization, circular economy'}
                            {sector.sector === 'Transportation' && 'Electric fleets, sustainable fuels'}
                            {sector.sector === 'Mining' && 'Solar power, equipment electrification'}
                            {sector.sector === 'FMCG' && 'Sustainable packaging, regenerative agriculture'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Decarbonization;
