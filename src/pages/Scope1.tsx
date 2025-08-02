
import React, { useState } from 'react';
import { ArrowLeft, Factory, Truck, Fuel, Zap, TrendingUp, Users, Building, DollarSign, Award, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanies } from '@/hooks/useCompanies';
import { useEnhancedScope1Data } from '@/hooks/useEnhancedScope1Data';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import BenchmarkingSection from '@/components/BenchmarkingSection';

const Scope1 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('apple'); // Changed from 'techcorp' to valid company ID
  const [selectedYear, setSelectedYear] = useState('2024');
  const { data: companies } = useCompanies();
  const { data: enhancedData, isLoading, error } = useEnhancedScope1Data(selectedCompany);

  const getIconForType = (iconType: 'fuel' | 'truck' | 'zap' | 'factory') => {
    switch (iconType) {
      case 'fuel':
        return <Fuel className="h-4 w-4" />;
      case 'truck':
        return <Truck className="h-4 w-4" />;
      case 'zap':
        return <Zap className="h-4 w-4" />;
      case 'factory':
        return <Factory className="h-4 w-4" />;
      default:
        return <Factory className="h-4 w-4" />;
    }
  };

  const availableYears = ['2019', '2020', '2021', '2022', '2023', '2024'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading enhanced Scope 1 data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading Scope 1 data: {error.message}</div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!enhancedData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">No Scope 1 data available for the selected company</div>
          <div className="text-gray-600 mb-4">Please try selecting a different company from the dropdown above.</div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { trendData, sourceData, sourceDataByYear, benchmarkData, insights } = enhancedData;
  
  // Get year-specific source data with proper fallback
  const getSourceDataForYear = (year: string) => {
    const yearData = sourceDataByYear[year];
    if (yearData && Array.isArray(yearData) && yearData.length > 0) {
      return yearData;
    }
    // Fallback to current source data if year-specific data is not available
    if (sourceData && Array.isArray(sourceData) && sourceData.length > 0) {
      return sourceData;
    }
    // Final fallback - return empty array to prevent errors
    return [];
  };

  const currentSourceData = getSourceDataForYear(selectedYear).map(item => ({
    ...item,
    icon: getIconForType(item.iconType)
  }));

  // Debug logging
  console.log('Scope1 Debug:', {
    selectedYear,
    sourceDataByYear: Object.keys(sourceDataByYear),
    sourceDataLength: sourceData?.length,
    currentSourceDataLength: currentSourceData.length,
    currentSourceData
  });

  const selectedCompanyData = companies?.find(c => c.id === selectedCompany);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 1 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">Direct emissions from owned or controlled sources with comprehensive benchmarking</p>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-gray-800">Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <EnhancedMetricCard
          title="Emissions Intensity"
          value={benchmarkData.emissionsIntensity}
          unit="tCO2e per $M"
          subtitle="Revenue-based efficiency"
          benchmarkStatus={benchmarkData.performanceIndicators.intensityVsAvg}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <EnhancedMetricCard
          title="Per Employee"
          value={benchmarkData.perEmployee}
          unit="tCO2e per employee"
          subtitle="Workforce efficiency"
          benchmarkStatus={benchmarkData.performanceIndicators.employeeVsAvg}
          icon={<Users className="h-4 w-4" />}
        />
        
        <EnhancedMetricCard
          title="Facility Efficiency"
          value={benchmarkData.facilityEfficiency}
          unit="tCO2e per sq ft"
          subtitle="Space utilization efficiency"
          benchmarkStatus={benchmarkData.performanceIndicators.efficiencyVsAvg}
          icon={<Building className="h-4 w-4" />}
        />
        
        <EnhancedMetricCard
          title="Industry Rank"
          value={`${benchmarkData.industryRank} of ${benchmarkData.totalInSector}`}
          subtitle={`${selectedCompanyData?.sector || 'Industry'} companies`}
          icon={<Award className="h-4 w-4" />}
        />
        
        <EnhancedMetricCard
          title="Annual Reduction"
          value={benchmarkData.annualReduction}
          unit="%"
          subtitle="Year-over-year improvement"
          trend={benchmarkData.annualReduction > 0 ? 'up' : 'down'}
          change={benchmarkData.annualReduction}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        
        <EnhancedMetricCard
          title="Carbon Cost Exposure"
          value={`$${benchmarkData.carbonCostExposure.toLocaleString()}`}
          subtitle="Annual carbon pricing impact"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Enhanced Emissions Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Scope 1 Emissions Trend with Industry Benchmark</CardTitle>
          <CardDescription>Historical direct emissions vs industry average with percentile ranking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => {
                  const labels = {
                    emissions: 'Company Emissions',
                    industryAverage: 'Industry Average',
                    percentileRank: 'Percentile Rank'
                  };
                  return [`${value}${name === 'percentileRank' ? 'th' : ' tCO2e'}`, labels[name as keyof typeof labels]];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="emissions" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', r: 6 }}
                name="emissions"
              />
              <Line 
                type="monotone" 
                dataKey="industryAverage" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#94a3b8', r: 4 }}
                name="industryAverage"
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Performance Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Performance Summary:</span>
              <span className="text-gray-600">
                Currently ranking in the {trendData[trendData.length - 1]?.percentileRank || 50}th percentile of {selectedCompanyData?.sector || 'industry'} companies
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Emissions by Source */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Enhanced Emissions by Source</CardTitle>
            <CardDescription>Detailed breakdown with industry benchmarks and efficiency metrics for {selectedYear}</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {currentSourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={currentSourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="source" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} tCO2e (${props.payload.percentage}%)`,
                      'Emissions'
                    ]}
                    labelFormatter={(label) => `Source: ${label}`}
                  />
                  <Bar dataKey="emissions" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">
                No emissions data is available for {selectedCompanyData?.name || 'this company'} in {selectedYear}.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Try selecting a different year</p>
                <p>• Check if the company has Scope 1 emissions data</p>
                <p>• Contact support if this issue persists</p>
              </div>
            </div>
          )}
          
          {/* Enhanced Source Metrics */}
          {currentSourceData.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentSourceData.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item.source}</div>
                      <div className="text-xs text-gray-600">{Math.round(item.emissions)} tCO2e ({item.percentage}%)</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry Range:</span>
                      <span className="font-medium">{item.industryTypicalRange.min}-{item.industryTypicalRange.max}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency Metric:</span>
                      <span className="font-medium">{item.efficiencyMetric}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost/tonne:</span>
                      <span className="font-medium">${item.costPerTonne}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Content for Benchmarking and Insights */}
      <Tabs defaultValue="benchmarking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="benchmarking">Industry Benchmarking</TabsTrigger>
          <TabsTrigger value="insights">Performance Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="benchmarking">
          <BenchmarkingSection 
            benchmarkData={benchmarkData}
            companyName={selectedCompanyData?.name || 'Company'}
            sector={selectedCompanyData?.sector || 'Industry'}
          />
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Performance vs Peers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Performance vs Peers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.performanceVsPeers.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-600">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Improvement Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Improvement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.improvementOpportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-600">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Cost-Benefit Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Cost-Benefit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.costBenefitHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scope1;
