
import React, { useState } from 'react';
import { ArrowLeft, Zap, Thermometer, Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';

const Scope2 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: companies } = useCompanies();

  const trendData = [
    { year: '2020', marketBased: 800, locationBased: 850 },
    { year: '2021', marketBased: 750, locationBased: 780 },
    { year: '2022', marketBased: 700, locationBased: 720 },
    { year: '2023', marketBased: 650, locationBased: 670 },
    { year: '2024', marketBased: 600, locationBased: 620 }
  ];

  const sourceData = [
    { source: 'Electricity', emissions: 450, icon: <Zap className="h-4 w-4" /> },
    { source: 'Steam', emissions: 100, icon: <Thermometer className="h-4 w-4" /> },
    { source: 'Cooling', emissions: 50, icon: <Snowflake className="h-4 w-4" /> }
  ];

  const locationData = [
    { location: 'North America', emissions: 350, percentage: 58 },
    { location: 'Europe', emissions: 180, percentage: 30 },
    { location: 'Asia Pacific', emissions: 70, percentage: 12 }
  ];

  const sourceColors = ['#ea580c', '#f59e0b', '#84cc16'];
  const locationColors = ['#3b82f6', '#8b5cf6', '#06b6d4'];

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scope 2 Emissions Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">Indirect emissions from purchased energy consumption</p>
        
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
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Source</CardTitle>
            <CardDescription>Breakdown by energy consumption category</CardDescription>
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
                    <Cell key={`cell-${index}`} fill={sourceColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emissions by Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Emissions by Location</CardTitle>
            <CardDescription>Regional distribution of energy consumption</CardDescription>
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
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={locationColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              </PieChart>
            </ResponsiveContainer>
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
                  <span className="text-gray-600">25% reduction in energy-related emissions over 4 years</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">Successful implementation of energy efficiency measures</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-600">North America accounts for 58% of energy emissions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Increase renewable energy procurement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Implement advanced building management systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Explore power purchase agreements (PPAs)</span>
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
