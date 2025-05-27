
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Scope1 = () => {
  const trendData = [
    { year: '2019', emissions: 1200 },
    { year: '2020', emissions: 1100 },
    { year: '2021', emissions: 1000 },
    { year: '2022', emissions: 950 },
    { year: '2023', emissions: 900 }
  ];

  const sourceData = [
    { source: 'Stationary Combustion', emissions: 450 },
    { source: 'Mobile Combustion', emissions: 280 },
    { source: 'Process Emissions', emissions: 120 },
    { source: 'Fugitive Emissions', emissions: 50 }
  ];

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
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Year Trend: Total Scope 1 Emissions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
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
          <BarChart data={sourceData}>
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
