
import React, { useState } from 'react';
import { ArrowLeft, Factory, Truck, Fuel, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';

const Scope1 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: companies } = useCompanies();

  const trendData = [
    { year: '2020', emissions: 1200 },
    { year: '2021', emissions: 1150 },
    { year: '2022', emissions: 1100 },
    { year: '2023', emissions: 1000 },
    { year: '2024', emissions: 950 }
  ];

  const sourceData = [
    { source: 'Natural Gas', emissions: 450, icon: <Fuel className="h-4 w-4" /> },
    { source: 'Diesel Fuel', emissions: 280, icon: <Truck className="h-4 w-4" /> },
    { source: 'Company Vehicles', emissions: 150, icon: <Truck className="h-4 w-4" /> },
    { source: 'Refrigerants', emissions: 70, icon: <Zap className="h-4 w-4" /> }
  ];

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
        <p className="text-lg text-gray-600 mb-6">Direct emissions from owned or controlled sources</p>
        
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

      {/* Emissions Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Scope 1 Emissions Trend</CardTitle>
          <CardDescription>Historical direct emissions data showing year-over-year progress</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Scope 1 Emissions']} />
              <Line 
                type="monotone" 
                dataKey="emissions" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Emissions by Source */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Emissions by Source</CardTitle>
          <CardDescription>Breakdown of direct emissions by emission source category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="source" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              <Bar dataKey="emissions" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Source Legend */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {sourceData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
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
                  <span className="text-gray-600">21% reduction in direct emissions over 4 years</span>
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
