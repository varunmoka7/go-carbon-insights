
import React, { useState } from 'react';
import { ArrowLeft, Factory, Truck, Fuel, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScope1Data } from '@/hooks/useScope1Data';
import { enhancedCompanies } from '@/data/enhancedMockData';

const Scope1 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  
  const { data: scope1Data, isLoading, error } = useScope1Data(selectedCompany);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;
  if (!scope1Data) return <div className="text-center">No data available</div>;

  // Enhanced colors for professional appearance
  const trendColors = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'];
  const sourceColors = ['#dc2626', '#ea580c', '#d97706', '#65a30d'];

  const sourceDataWithIcons = scope1Data.sourceData.map((item, index) => ({
    ...item,
    color: sourceColors[index],
    icon: index === 0 ? <Factory className="h-4 w-4" /> : 
          index === 1 ? <Fuel className="h-4 w-4" /> :
          index === 2 ? <Truck className="h-4 w-4" /> :
          <Zap className="h-4 w-4" />
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 1 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">Direct emissions from owned or controlled sources</p>
        
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

      {/* Emissions Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Scope 1 Emissions Trend</CardTitle>
          <CardDescription className="text-gray-600">
            Historical direct emissions data showing year-over-year progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={scope1Data.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                formatter={(value) => [`${value} tCO2e`, 'Scope 1 Emissions']}
                labelStyle={{ fontWeight: '600', color: '#1f2937' }}
              />
              <Line 
                type="monotone" 
                dataKey="emissions" 
                stroke="#dc2626" 
                strokeWidth={4}
                dot={{ fill: '#dc2626', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#dc2626', strokeWidth: 3, fill: '#fef2f2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Emissions by Source */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Emissions by Source</CardTitle>
          <CardDescription className="text-gray-600">
            Breakdown of direct emissions by emission source category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart 
              data={sourceDataWithIcons} 
              margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
              <XAxis 
                dataKey="source" 
                stroke="#6b7280"
                fontSize={13}
                fontWeight={600}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={100}
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
                formatter={(value) => [`${value} tCO2e`, 'Emissions']}
                labelStyle={{ fontWeight: '600', color: '#1f2937' }}
              />
              <Bar 
                dataKey="emissions" 
                radius={[8, 8, 0, 0]}
                fill="#dc2626"
              >
                {sourceDataWithIcons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Source Legend with Icons */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {sourceDataWithIcons.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.source}</div>
                  <div className="text-xs text-gray-600">{item.emissions} tCO2e</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                  <span className="text-gray-600">23% reduction in direct emissions over 5 years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Significant progress in fuel efficiency improvements</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Natural gas remains the largest emission source</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Transition to renewable heating systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Electrify vehicle fleet operations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Implement advanced refrigerant management</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope1;
