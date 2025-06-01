
import React, { useState } from 'react';
import { ArrowLeft, Package, Truck, Users, Recycle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';

const Scope3 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: companies } = useCompanies();

  const trendData = [
    { year: '2020', emissions: 2500 },
    { year: '2021', emissions: 2300 },
    { year: '2022', emissions: 2100 },
    { year: '2023', emissions: 1900 },
    { year: '2024', emissions: 1750 }
  ];

  const categoryData = [
    { category: 'Purchased Goods', emissions: 650, percentage: 37 },
    { category: 'Transportation', emissions: 420, percentage: 24 },
    { category: 'Business Travel', emissions: 280, percentage: 16 },
    { category: 'Employee Commuting', emissions: 210, percentage: 12 },
    { category: 'Waste', emissions: 120, percentage: 7 },
    { category: 'Other', emissions: 70, percentage: 4 }
  ];

  const upstreamDownstream = [
    { category: 'Upstream', emissions: 1200, color: '#0d9488' },
    { category: 'Downstream', emissions: 550, color: '#14b8a6' }
  ];

  const categoryColors = ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#0d9488', '#0891b2'];

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 3 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">All other indirect emissions in your value chain</p>
        
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

      {/* Emissions Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Scope 3 Emissions Trend</CardTitle>
          <CardDescription>Historical value chain emissions showing improvement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Scope 3 Emissions']} />
              <Line 
                type="monotone" 
                dataKey="emissions" 
                stroke="#0d9488" 
                strokeWidth={3}
                dot={{ fill: '#0d9488', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Category</CardTitle>
            <CardDescription>Breakdown of Scope 3 emissions by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="emissions"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upstream vs Downstream */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Upstream vs Downstream</CardTitle>
            <CardDescription>Distribution across value chain</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={upstreamDownstream} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
                <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
                  {upstreamDownstream.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Upstream Activities</span>
                <span className="text-sm">1,200 tCO2e (69%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Downstream Activities</span>
                <span className="text-sm">550 tCO2e (31%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Category Performance</CardTitle>
          <CardDescription>Detailed breakdown of all Scope 3 categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
                  <span className="text-gray-600">30% reduction in value chain emissions over 4 years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Upstream activities represent 69% of Scope 3 emissions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Purchased goods remain the largest category at 37%</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Engage suppliers on emission reduction programs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Implement sustainable procurement policies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Optimize transportation and logistics networks</span>
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
