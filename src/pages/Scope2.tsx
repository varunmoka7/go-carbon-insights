
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, getCompanyById } from '@/data/mockData';

const Scope2 = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');

  const company = getCompanyById(selectedCompany);

  if (!company) {
    return <div>Company not found</div>;
  }

  const reductionInitiatives = [
    'Transition to 100% renewable electricity',
    'Implement smart building management systems',
    'Upgrade to energy-efficient HVAC systems',
    'Install LED lighting throughout facilities',
    'Optimize server room cooling efficiency'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scope 2 Emissions Analysis</h1>
        <p className="text-gray-600">Indirect emissions from purchased electricity, steam, heating, and cooling</p>
        
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Year Trend: Total Scope 2 Emissions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={company.scope2Data.trendData}>
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
              stroke="#ea580c" 
              strokeWidth={3}
              dot={{ fill: '#ea580c', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Emissions Breakdown by Source */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions Breakdown by Source</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={company.scope2Data.sourceData}>
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
            <Bar dataKey="emissions" fill="#ea580c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions by Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions by Location</h2>
          <div className="space-y-4">
            {company.scope2Data.locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{location.location}</span>
                  <span className="text-sm text-gray-500 ml-2">{location.percentage}</span>
                </div>
                <span className="font-semibold text-gray-700">{location.emissions} tCO2e</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reduction Initiatives */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reduction Initiatives</h2>
          <div className="space-y-3">
            {reductionInitiatives.map((initiative, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{initiative}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Short-term Actions</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Switch to renewable energy tariffs</li>
              <li>• Implement energy monitoring systems</li>
              <li>• Optimize equipment usage schedules</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Long-term Strategy</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Install on-site renewable generation</li>
              <li>• Pursue LEED certification for buildings</li>
              <li>• Develop energy efficiency programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope2;
