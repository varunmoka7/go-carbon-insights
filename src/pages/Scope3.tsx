
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanies } from '@/hooks/useCompanies';
import { useScope3Data } from '@/hooks/useScope3Data';

const Scope3 = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [selectedFactor, setSelectedFactor] = useState('supplier-engagement');
  const { data: companies = [] } = useCompanies();
  const { data: scope3Data, isLoading } = useScope3Data(selectedCompany);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!scope3Data) {
    return <div className="text-center text-gray-600">No data available</div>;
  }

  const impactFactors = {
    'supplier-engagement': [
      { factor: 'Sustainable Procurement', impact: 450 },
      { factor: 'Local Sourcing', impact: 320 },
      { factor: 'Supplier Training', impact: 280 },
      { factor: 'Green Contracts', impact: 180 }
    ],
    'travel-optimization': [
      { factor: 'Virtual Meetings', impact: 180 },
      { factor: 'Efficient Routes', impact: 120 },
      { factor: 'Public Transport', impact: 80 },
      { factor: 'Electric Vehicles', impact: 60 }
    ],
    'waste-reduction': [
      { factor: 'Circular Design', impact: 150 },
      { factor: 'Recycling Programs', impact: 100 },
      { factor: 'Waste Prevention', impact: 80 },
      { factor: 'Composting', impact: 40 }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scope 3 Emissions Analysis</h1>
        <p className="text-gray-600">All other indirect emissions in your value chain</p>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4 mt-6">
          <label className="text-sm font-medium text-gray-700">Select Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Year Trend: Total Scope 3 Emissions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scope3Data.trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} tCO2e`, 'Emissions']}
            />
            <Line 
              type="monotone" 
              dataKey="emissions" 
              stroke="#0d9488" 
              strokeWidth={3}
              dot={{ fill: '#0d9488', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Emissions (tCO2e)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Influence Factors</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actionable Insights</th>
              </tr>
            </thead>
            <tbody>
              {scope3Data.categoryData.map((category, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{category.category}</td>
                  <td className="py-4 px-4 text-gray-700">{category.emissions}</td>
                  <td className="py-4 px-4 text-gray-600">{category.influenceFactors}</td>
                  <td className="py-4 px-4 text-gray-600">{category.insights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Impact of Selected Influence Factors</h2>
        
        {/* Factor Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedFactor === 'supplier-engagement' ? 'default' : 'outline'}
            onClick={() => setSelectedFactor('supplier-engagement')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Supplier Engagement
          </Button>
          <Button
            variant={selectedFactor === 'travel-optimization' ? 'default' : 'outline'}
            onClick={() => setSelectedFactor('travel-optimization')}
          >
            Travel Optimization
          </Button>
          <Button
            variant={selectedFactor === 'waste-reduction' ? 'default' : 'outline'}
            onClick={() => setSelectedFactor('waste-reduction')}
          >
            Waste Reduction
          </Button>
        </div>

        {/* Impact Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactFactors[selectedFactor]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="factor" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} tCO2e`, 'Potential Reduction']}
            />
            <Bar dataKey="impact" fill="#0d9488" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Scope3;
