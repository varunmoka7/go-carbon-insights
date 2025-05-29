
import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Plane, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useScope3Data } from '@/hooks/useScope3Data';
import { enhancedCompanies } from '@/data/enhancedMockData';

const Scope3 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  
  const { data: scope3Data, isLoading, error } = useScope3Data(selectedCompany);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;
  if (!scope3Data) return <div className="text-center">No data available</div>;

  // Enhanced professional color palette
  const categoryColors = ['#0d9488', '#059669', '#10b981', '#34d399'];

  const categoryDataWithIcons = scope3Data.categoryData.map((item, index) => ({
    ...item,
    color: categoryColors[index],
    icon: index === 0 ? <ShoppingCart className="h-4 w-4" /> : 
          index === 1 ? <Plane className="h-4 w-4" /> :
          index === 2 ? <Users className="h-4 w-4" /> :
          <Trash2 className="h-4 w-4" />
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 3 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">Indirect emissions from value chain activities</p>
        
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
          <CardTitle className="text-2xl font-bold text-gray-900">Scope 3 Emissions Trend</CardTitle>
          <CardDescription className="text-gray-600">
            Historical value chain emissions showing upstream and downstream activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={scope3Data.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                formatter={(value) => [`${value} tCO2e`, 'Scope 3 Emissions']}
                labelStyle={{ fontWeight: '600', color: '#1f2937' }}
              />
              <Line 
                type="monotone" 
                dataKey="emissions" 
                stroke="#0d9488" 
                strokeWidth={4}
                dot={{ fill: '#0d9488', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#0d9488', strokeWidth: 3, fill: '#f0fdfa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Emissions by Category</CardTitle>
          <CardDescription className="text-gray-600">
            Major Scope 3 categories with influence factors and strategic insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={categoryDataWithIcons} 
              margin={{ top: 30, right: 30, left: 20, bottom: 100 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={600}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={120}
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
                fill="#0d9488"
              >
                {categoryDataWithIcons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Category Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Category Analysis & Strategic Insights</CardTitle>
          <CardDescription className="text-gray-600">
            Detailed breakdown with influence factors and actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold text-right">Emissions (tCO2e)</TableHead>
                  <TableHead className="font-semibold">Key Influence Factors</TableHead>
                  <TableHead className="font-semibold">Strategic Insights</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryDataWithIcons.map((category, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <span className="font-semibold text-gray-800">{category.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-lg font-bold text-gray-800">
                      {category.emissions}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      {category.influenceFactors}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-xs">
                      <span className="bg-teal-50 text-teal-800 px-2 py-1 rounded text-xs font-medium">
                        {category.insights}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Key Insights & Strategic Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Performance Analysis</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">19% reduction in value chain emissions over 5 years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Purchased goods represent 75% of total Scope 3 emissions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Strong progress in employee commuting reduction</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Priority Actions</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Implement comprehensive supplier engagement program</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Establish virtual-first travel policy framework</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Enhance circular economy and waste prevention</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3;
