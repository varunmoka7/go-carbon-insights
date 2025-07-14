import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, Area, AreaChart
} from 'recharts';
import { 
  Globe, TrendingDown, TrendingUp, Building2, Leaf, Target, 
  Filter, Search, MapPin, Calendar, AlertCircle, CheckCircle2
} from 'lucide-react';
import { 
  mockCompanies, 
  mockSBTiData, 
  mockSectorTimeSeries, 
  mockGeographicData,
  dashboardSummary,
  sectorBenchmarks,
  sectors,
  regions,
  scope3Categories
} from '../data/mockData';

const Dashboard = () => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedScope, setSelectedScope] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Filter companies based on selections
  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      const matchesSector = selectedSector === 'all' || company.sector === selectedSector;
      const matchesRegion = selectedRegion === 'all' || company.region === selectedRegion;
      const matchesSearch = !searchTerm || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSector && matchesRegion && matchesSearch;
    });
  }, [selectedSector, selectedRegion, searchTerm]);

  // Calculate filtered statistics
  const filteredStats = useMemo(() => {
    const totalEmissions = filteredCompanies.reduce((sum, c) => sum + c.emissions.total, 0);
    const avgIntensity = filteredCompanies.reduce((sum, c) => sum + c.emissions.intensity, 0) / filteredCompanies.length;
    
    return {
      totalCompanies: filteredCompanies.length,
      totalEmissions,
      avgIntensity,
      cdpARated: filteredCompanies.filter(c => c.cdpRating === 'A').length,
      highDisclosure: filteredCompanies.filter(c => c.disclosureQuality === 'High').length
    };
  }, [filteredCompanies]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Corporate Carbon Emissions GPS</h1>
                <p className="text-gray-600">Global Intelligence Dashboard - 300,000+ Companies</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Leaf className="h-4 w-4 mr-1" />
                Real-time Tracking
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                21 Sectors • 185 Industries
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Search Companies</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by company, sector, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium mb-2">Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector.id} value={sector.id}>{sector.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm font-medium mb-2">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm font-medium mb-2">Scope</label>
                <Select value={selectedScope} onValueChange={setSelectedScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Scopes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="scope1">Scope 1</SelectItem>
                    <SelectItem value="scope2">Scope 2</SelectItem>
                    <SelectItem value="scope3">Scope 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {filteredStats.totalCompanies.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((filteredStats.totalCompanies / dashboardSummary.totalCompanies) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(filteredStats.totalEmissions / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-500 mt-1">tons CO2e</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">CDP A-Rated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredStats.cdpARated.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((filteredStats.cdpARated / filteredStats.totalCompanies) * 100).toFixed(1)}% of filtered
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">High Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {filteredStats.highDisclosure.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((filteredStats.highDisclosure / filteredStats.totalCompanies) * 100).toFixed(1)}% quality
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview">Global Overview</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
            <TabsTrigger value="companies">Company Explorer</TabsTrigger>
            <TabsTrigger value="sbti">SBTi Tracker</TabsTrigger>
            <TabsTrigger value="geographic">Geographic View</TabsTrigger>
          </TabsList>

          {/* Global Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Emissions by Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sectorBenchmarks.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sectorName" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [(value / 1000000).toFixed(1) + 'M tons CO2e', 'Emissions']} />
                      <Bar dataKey="totalEmissions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Emission Intensity by Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sectorBenchmarks.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sectorName" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [value.toFixed(6), 'Intensity']} />
                      <Line type="monotone" dataKey="avgIntensity" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Global Emissions Trend (2019-2024)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockSectorTimeSeries.slice(0, 6).map(s => s.data).flat()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [(value / 1000000).toFixed(1) + 'M tons CO2e', 'Emissions']} />
                    <Legend />
                    {mockSectorTimeSeries.slice(0, 6).map((sector, index) => (
                      <Line 
                        key={sector.sector} 
                        type="monotone" 
                        dataKey="emissions" 
                        stroke={colors[index]} 
                        strokeWidth={2}
                        name={sector.sectorName}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sectors Tab */}
          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {sectorBenchmarks.slice(0, 12).map((sector, index) => (
                <Card key={sector.sector} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{sector.sectorName}</CardTitle>
                    <Badge variant="outline">{sector.companies.toLocaleString()} companies</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Total Emissions</span>
                          <span className="font-medium">{(sector.totalEmissions / 1000000).toFixed(1)}M tons CO2e</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Avg Intensity</span>
                          <span className="font-medium">{sector.avgIntensity.toFixed(6)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disclosure Rate</span>
                          <span className="font-medium">{(sector.disclosureRate * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={sector.disclosureRate * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredCompanies.slice(0, 20).map((company) => (
                <Card key={company.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <Badge variant="outline">{company.sectorName}</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {company.industry}
                          </Badge>
                          <Badge variant={company.cdpRating === 'A' ? 'default' : 'secondary'}>
                            CDP: {company.cdpRating}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.country}
                          </span>
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {company.employees.toLocaleString()} employees
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            ${(company.revenue / 1000000000).toFixed(1)}B revenue
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {(company.emissions.total / 1000).toFixed(1)}k
                        </div>
                        <p className="text-sm text-gray-500">tons CO2e</p>
                        <div className="flex items-center mt-1">
                          {company.emissions.yearOverYear > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                          )}
                          <span className={`text-sm ${company.emissions.yearOverYear > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {company.emissions.yearOverYear > 0 ? '+' : ''}{(company.emissions.yearOverYear * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SBTi Tracker Tab */}
          <TabsContent value="sbti" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">SBTi Committed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {mockSBTiData.length.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CDP A-rated companies</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">On Track</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {mockSBTiData.filter(s => s.status === 'On Track').length.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((mockSBTiData.filter(s => s.status === 'On Track').length / mockSBTiData.length) * 100).toFixed(1)}% of committed
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {(mockSBTiData.reduce((sum, s) => sum + s.targetReduction, 0) / mockSBTiData.length).toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">target reduction</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockSBTiData.slice(0, 10).map((sbti) => (
                <Card key={sbti.companyId} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{sbti.companyName}</h3>
                          <Badge variant="outline">{sbti.sector}</Badge>
                          <Badge variant={sbti.status === 'On Track' ? 'default' : 'secondary'}>
                            {sbti.status === 'On Track' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                            {sbti.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Target: {sbti.targetReduction.toFixed(1)}% by {sbti.targetYear}</span>
                          <span>Current: {sbti.currentReduction.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {((sbti.currentReduction / sbti.targetReduction) * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm text-gray-500">progress</p>
                        <Progress value={(sbti.currentReduction / sbti.targetReduction) * 100} className="w-24 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Emissions by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockGeographicData.slice(0, 10)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="emissions"
                      >
                        {mockGeographicData.slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [(value / 1000000).toFixed(1) + 'M tons CO2e', 'Emissions']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Company Distribution by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockGeographicData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [value.toLocaleString(), 'Companies']} />
                      <Bar dataKey="companies" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Geographic Heatmap Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive geographic heatmap visualization</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing emissions intensity across {mockGeographicData.length} countries
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;