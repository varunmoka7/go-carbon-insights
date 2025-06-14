
import React, { useState } from 'react';
import { ArrowLeft, Zap, Thermometer, Snowflake, BarChart3, Target, DollarSign, TrendingUp, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';
import { useEnhancedScope2Data } from '@/hooks/useEnhancedScope2Data';
import { useScope2Data } from '@/hooks/useScope2Data';
import EnergyKPICard from '@/components/EnergyKPICard';
import RegionalEnergyCard from '@/components/RegionalEnergyCard';

const Scope2 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [selectedYear, setSelectedYear] = useState('2024');
  const { data: companies } = useCompanies();
  const { data: enhancedData, isLoading: enhancedLoading } = useEnhancedScope2Data(selectedCompany);
  const { data: scope2Data, isLoading: scope2Loading } = useScope2Data(selectedCompany);

  const sourceIcons = {
    'Purchased Electricity': <Zap className="h-4 w-4" />,
    'Steam & Heating': <Thermometer className="h-4 w-4" />,
    'Cooling': <Snowflake className="h-4 w-4" />
  };

  const availableYears = ['2019', '2020', '2021', '2022', '2023', '2024'];

  if (enhancedLoading || scope2Loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading Scope 2 data...</div>
      </div>
    );
  }

  const trendData = scope2Data?.trendData || [];
  const energyKPIs = enhancedData?.energyKPIs;
  const benchmarking = enhancedData?.benchmarking;
  const regionalData = enhancedData?.regionalData || [];
  const insights = enhancedData?.insights;
  
  // Get year-specific data with proper fallbacks
  const getSourceDataForYear = (year: string) => {
    if (scope2Data?.sourceDataByYear && scope2Data.sourceDataByYear[year]) {
      return scope2Data.sourceDataByYear[year];
    }
    return scope2Data?.sourceData || [];
  };

  const getLocationDataForYear = (year: string) => {
    if (scope2Data?.locationDataByYear && scope2Data.locationDataByYear[year]) {
      return scope2Data.locationDataByYear[year];
    }
    return scope2Data?.locationData || [];
  };

  const sourceData = getSourceDataForYear(selectedYear).map(item => ({
    ...item,
    icon: sourceIcons[item.source as keyof typeof sourceIcons] || <Zap className="h-4 w-4" />
  }));
  const locationData = getLocationDataForYear(selectedYear);

  const sourceColors = ['#ea580c', '#f59e0b', '#84cc16'];
  const locationColors = ['#3b82f6', '#8b5cf6', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 2 Energy Intelligence</h1>
        <p className="text-lg text-gray-600 mb-6">Comprehensive analysis of indirect emissions from purchased energy</p>
        
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

      {/* Energy Performance KPIs */}
      {energyKPIs && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Energy Performance KPIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <EnergyKPICard
              title="Grid Carbon Intensity"
              value={energyKPIs.gridCarbonIntensity.value}
              unit={energyKPIs.gridCarbonIntensity.unit}
              subtitle={`Industry avg: ${energyKPIs.gridCarbonIntensity.industryAvg} kg CO2/MWh`}
              status={energyKPIs.gridCarbonIntensity.status as "good" | "average" | "poor"}
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <EnergyKPICard
              title="Renewable Energy %"
              value={energyKPIs.renewableEnergyPercent.value}
              unit="% of total electricity"
              status={energyKPIs.renewableEnergyPercent.status as "good" | "average" | "poor"}
              progress={energyKPIs.renewableEnergyPercent.value}
              target={energyKPIs.renewableEnergyPercent.target}
              icon={<Zap className="h-4 w-4" />}
            />
            <EnergyKPICard
              title="Energy Intensity"
              value={energyKPIs.energyIntensity.value}
              unit={energyKPIs.energyIntensity.unit}
              subtitle={`Rank ${energyKPIs.energyIntensity.rank} of ${energyKPIs.energyIntensity.total}`}
              status={"average" as const}
              icon={<Target className="h-4 w-4" />}
            />
            <EnergyKPICard
              title="Industry Energy Rank"
              value={`${energyKPIs.industryRank.position} of ${energyKPIs.industryRank.total}`}
              subtitle={`in ${energyKPIs.industryRank.sector}`}
              status={energyKPIs.industryRank.position <= energyKPIs.industryRank.total / 3 ? "good" as const : "average" as const}
              icon={<Award className="h-4 w-4" />}
            />
            <EnergyKPICard
              title="Annual Energy Reduction"
              value={energyKPIs.annualReduction.value}
              unit="% decrease YoY"
              subtitle={`Target: ${energyKPIs.annualReduction.target}%`}
              status={energyKPIs.annualReduction.status as "good" | "average" | "poor"}
              trend={energyKPIs.annualReduction.value > 0 ? 'down' : 'up'}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <EnergyKPICard
              title="Carbon Cost Exposure"
              value={`$${(energyKPIs.carbonCostExposure.value / 1000).toFixed(0)}K`}
              subtitle="estimated annual impact"
              status={energyKPIs.carbonCostExposure.trend === 'decreasing' ? "good" as const : "average" as const}
              trend={energyKPIs.carbonCostExposure.trend === 'increasing' ? 'up' : energyKPIs.carbonCostExposure.trend === 'decreasing' ? 'down' : 'stable'}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </div>
      )}

      {/* Market-based vs Location-based Emissions Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Market-based vs Location-based Emissions</CardTitle>
          <CardDescription>Comparison of emission accounting methodologies over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => [`${value} tCO2e`, name]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="marketBased" 
                stroke="#dc2626" 
                strokeWidth={3}
                name="Market-based"
                dot={{ fill: '#dc2626', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="locationBased" 
                stroke="#7c3aed" 
                strokeWidth={3}
                name="Location-based"
                dot={{ fill: '#7c3aed', r: 6 }}
                strokeDasharray="8 8"
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Enhanced Context Cards */}
          {insights && (
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Market-based Approach</h4>
                  <p className="text-sm text-red-700">{insights.marketLocationExplanation.marketBased}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Location-based Approach</h4>
                  <p className="text-sm text-purple-700">{insights.marketLocationExplanation.locationBased}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Clean Energy Impact</h4>
                  <p className="text-sm text-green-700">{insights.marketLocationExplanation.impact}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Benchmarking Section */}
      {benchmarking && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Benchmarking</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">#{benchmarking.efficiencyRank}</div>
                <div className="text-sm text-gray-600">Energy Efficiency Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">{benchmarking.intensityPercentile}th</div>
                <div className="text-sm text-gray-600">Energy Intensity Percentile</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">#{benchmarking.renewableRank}</div>
                <div className="text-sm text-gray-600">Renewable Energy Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">#{benchmarking.regionalRank}</div>
                <div className="text-sm text-gray-600">Regional Performance</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Regional Energy Intelligence */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-6 w-6 text-teal-600" />
          Regional Energy Intelligence
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {regionalData.map((region, index) => (
            <RegionalEnergyCard 
              key={index} 
              region={region.region}
              gridIntensity={region.gridIntensity}
              gridStatus={region.gridStatus}
              consumptionPercent={region.consumptionPercent}
              renewableProgress={region.renewableProgress}
              opportunities={region.opportunities}
              achievements={region.achievements}
            />
          ))}
        </div>
      </div>

      {/* Emissions by Source */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Source</CardTitle>
            <CardDescription>Breakdown by energy consumption category for {selectedYear}</CardDescription>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 gap-2">
            {sourceData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">{item.source}</span>
                  <span className="text-xs text-gray-600 ml-2">{Math.round(item.emissions)} tCO2e</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emissions by Location */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Location</CardTitle>
            <CardDescription>Regional distribution of energy consumption for {selectedYear}</CardDescription>
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="emissions"
                label={({ location, percentage }) => `${location}: ${percentage}`}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={locationColors[index % locationColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {locationData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-800">{item.location}</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">{Math.round(item.emissions)} tCO2e</div>
                  <div className="text-xs text-green-600">
                    {item.renewablePercent} renewable
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Insights & Recommendations */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Strategic Energy Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Energy Performance Highlights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Energy Performance Highlights
                </h3>
                <ul className="space-y-3">
                  {insights.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Strategic Energy Opportunities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-600" />
                  Strategic Energy Opportunities
                </h3>
                <div className="space-y-3">
                  {insights.opportunities.map((opportunity, index) => (
                    <div key={index} className="border-l-4 border-teal-600 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{opportunity.title}</span>
                        <span className="text-sm font-semibold text-teal-600">{opportunity.impact}</span>
                      </div>
                      <p className="text-sm text-gray-600">{opportunity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scope2;
