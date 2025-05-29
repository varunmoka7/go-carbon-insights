
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { useScope2Data } from '@/hooks/useScope2Data';

const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa'];

const Scope2 = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [viewType, setViewType] = useState('market');
  const { data: companies = [] } = useCompanies();
  const { data: scope2Data, isLoading } = useScope2Data(selectedCompany);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!scope2Data) {
    return <div className="text-center text-gray-600">No data available</div>;
  }

  const reductionInitiatives = [
    'Transition to 100% renewable electricity',
    'Implement smart building management systems',
    'Upgrade to energy-efficient HVAC systems',
    'Install LED lighting throughout facilities',
    'Optimize server room cooling efficiency'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scope 2 Emissions Analysis</h1>
          <p className="text-gray-600">Indirect emissions from purchased electricity, steam, heating, and cooling</p>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Company:</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-64 backdrop-blur-sm bg-white/80">
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
            
            <div className="flex space-x-2">
              <Button
                variant={viewType === 'market' ? 'default' : 'outline'}
                onClick={() => setViewType('market')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Market-Based
              </Button>
              <Button
                variant={viewType === 'location' ? 'default' : 'outline'}
                onClick={() => setViewType('location')}
              >
                Location-Based
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trend Chart */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5-Year Trend: Scope 2 Emissions ({viewType === 'market' ? 'Market-Based' : 'Location-Based'})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scope2Data.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'tCO2e', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px'
                  }}
                  formatter={(value) => [`${value} tCO2e`, 'Emissions']}
                />
                <Bar 
                  dataKey={viewType === 'market' ? 'marketBased' : 'locationBased'} 
                  fill="#ea580c" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions by Source</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scope2Data.sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="emissions"
                >
                  {scope2Data.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emissions by Location */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions by Location</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Emissions</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">% Total</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">% Renewable</th>
                  </tr>
                </thead>
                <tbody>
                  {scope2Data.locationData.map((location, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                      <td className="py-2 px-3 font-medium text-gray-900">{location.location}</td>
                      <td className="py-2 px-3 text-gray-700">{location.emissions} tCO2e</td>
                      <td className="py-2 px-3 text-gray-700">{location.percentage}</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {location.renewablePercent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reduction Initiatives */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reduction Initiatives</h2>
            <div className="space-y-3">
              {reductionInitiatives.map((initiative, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{initiative}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/70 to-red-50/70 rounded-xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="backdrop-blur-sm bg-white/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Short-term Actions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Switch to renewable energy tariffs</li>
                <li>• Implement energy monitoring systems</li>
                <li>• Optimize equipment usage schedules</li>
              </ul>
            </div>
            <div className="backdrop-blur-sm bg-white/50 rounded-lg p-4">
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
    </div>
  );
};

export default Scope2;
