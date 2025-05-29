
import React, { useState } from 'react';
import { ArrowLeft, Zap, Thermometer, Snowflake, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScope2Data } from '@/hooks/useScope2Data';
import { enhancedCompanies } from '@/data/enhancedMockData';

const Scope2 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  
  const { data: scope2Data, isLoading, error } = useScope2Data(selectedCompany);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;
  if (!scope2Data) return <div className="text-center">No data available</div>;

  // Enhanced professional color palette
  const sourceColors = ['#ea580c', '#f59e0b', '#84cc16'];
  const locationColors = ['#3b82f6', '#8b5cf6', '#06b6d4'];
  const trendColors = ['#dc2626', '#7c3aed'];

  const sourceDataWithIcons = scope2Data.sourceData.map((item, index) => ({
    ...item,
    color: sourceColors[index],
    icon: index === 0 ? <Zap className="h-4 w-4" /> : 
          index === 1 ? <Thermometer className="h-4 w-4" /> :
          <Snowflake className="h-4 w-4" />
  }));

  const locationDataWithColors = scope2Data.locationData.map((item, index) => ({
    ...item,
    color: locationColors[index]
  }));

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 2 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">Indirect emissions from purchased energy consumption</p>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-gray-800">Company:</label>
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

      {/* Market-based vs Location-based Emissions Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Market-based vs Location-based Emissions</CardTitle>
          <CardDescription className="text-gray-600">
            Comparison of emission accounting methodologies over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={scope2Data.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={14}
                fontWeight={600}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={14}
                fontWeight={600}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                label={{ 
                  value: 'Emissions (tCO2e)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '14px', fontWeight: '600', fill: '#374151' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`${value} tCO2e`, name]}
                labelStyle={{ fontWeight: '600', color: '#1f2937' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px', fontWeight: '600' }}
              />
              <Line 
                type="monotone" 
                dataKey="marketBased" 
                stroke="#dc2626" 
                strokeWidth={4}
                name="Market-based"
                dot={{ fill: '#dc2626', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#dc2626', strokeWidth: 3, fill: '#fef2f2' }}
              />
              <Line 
                type="monotone" 
                dataKey="locationBased" 
                stroke="#7c3aed" 
                strokeWidth={4}
                name="Location-based"
                dot={{ fill: '#7c3aed', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#7c3aed', strokeWidth: 3, fill: '#f3f4f6' }}
                strokeDasharray="8 8"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Source</CardTitle>
            <CardDescription className="text-gray-600">
              Breakdown by energy consumption category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={sourceDataWithIcons} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
                <XAxis 
                  dataKey="source" 
                  stroke="#6b7280"
                  fontSize={12}
                  fontWeight={600}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                  tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  fontWeight={600}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                  tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} tCO2e`, 'Emissions']}
                />
                <Bar 
                  dataKey="emissions" 
                  radius={[6, 6, 0, 0]}
                  fill="#ea580c"
                >
                  {sourceDataWithIcons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Source Legend */}
            <div className="mt-4 space-y-2">
              {sourceDataWithIcons.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm text-gray-600 ml-auto">{item.emissions} tCO2e</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Regional Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              Emissions by geographic location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={locationDataWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="emissions"
                  label={({ location, percentage }) => `${location}: ${percentage}`}
                  labelLine={false}
                  fontSize={12}
                  fontWeight={600}
                >
                  {locationDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  formatter={(value) => [`${value} tCO2e`, 'Emissions']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Regional Details */}
            <div className="mt-6 space-y-3">
              {locationDataWithColors.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item.location}</div>
                      <div className="text-xs text-gray-600">Renewable: {item.renewablePercent}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">{item.emissions.toLocaleString()} tCO2e</div>
                    <div className="text-xs text-gray-600">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Performance Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">26% reduction in indirect emissions over 5 years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Europe leads with 80% renewable energy adoption</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Asia Pacific requires focused renewable transition</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Strategic Actions</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Accelerate renewable energy procurement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Implement energy efficiency programs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Pursue Power Purchase Agreements (PPAs)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope2;
