
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanies } from '@/hooks/useCompanies';
import { useScope1Data } from '@/hooks/useScope1Data';

const Scope1 = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: companies = [] } = useCompanies();
  const { data: scope1Data, isLoading } = useScope1Data(selectedCompany);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!scope1Data) {
    return <div className="text-center text-gray-600">No data available</div>;
  }

  const keyFactors = [
    { factor: 'Operational Efficiency', impact: '+12%', description: 'Improved equipment efficiency and maintenance' },
    { factor: 'Technology Upgrades', impact: '-18%', description: 'Implementation of cleaner technologies' },
    { factor: 'Fuel Switching', impact: '-25%', description: 'Transition to renewable energy sources' },
    { factor: 'Process Optimization', impact: '-8%', description: 'Streamlined manufacturing processes' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scope 1 Emissions Analysis</h1>
        <p className="text-gray-600">Direct emissions from sources owned or controlled by your company</p>
        
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Year Trend: Total Scope 1 Emissions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scope1Data.trendData}>
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
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Emissions by Source */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions by Source</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scope1Data.sourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="source" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} tCO2e`, 'Emissions']}
            />
            <Bar dataKey="emissions" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Factors Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Factors Influencing Scope 1 Emissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Factor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Impact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {keyFactors.map((factor, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{factor.factor}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      factor.impact.startsWith('-') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {factor.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{factor.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scope1;
