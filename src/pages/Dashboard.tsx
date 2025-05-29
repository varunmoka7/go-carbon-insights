
import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MetricCard from '@/components/MetricCard';
import FrameworksStatus from '@/components/FrameworksStatus';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { enhancedCompanies, getCompanyById } from '@/data/enhancedMockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [selectedScope, setSelectedScope] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const company = getCompanyById(selectedCompany);
  const filteredCompanies = enhancedCompanies.filter(comp => 
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!company) {
    return <div className="text-center text-gray-600">Company not found</div>;
  }

  // Prepare chart data based on selected scope
  const getChartData = () => {
    switch (selectedScope) {
      case 'scope1':
        return company.emissionsData.map(item => ({
          year: item.year,
          scope1: item.scope1
        }));
      case 'scope2':
        return company.emissionsData.map(item => ({
          year: item.year,
          scope2: item.scope2
        }));
      case 'scope1+2':
        return company.emissionsData.map(item => ({
          year: item.year,
          'scope1+2': item.scope1 + item.scope2
        }));
      case 'scope3':
        return company.emissionsData.map(item => ({
          year: item.year,
          scope3: item.scope3
        }));
      case 'total':
        return company.emissionsData.map(item => ({
          year: item.year,
          total: item.scope1 + item.scope2 + item.scope3
        }));
      default:
        return company.emissionsData.map(item => ({
          year: item.year,
          scope1: item.scope1,
          scope2: item.scope2,
          scope3: item.scope3,
          total: item.scope1 + item.scope2 + item.scope3
        }));
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Emissions Overview Dashboard</h1>
        
        {/* Company Selection with Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Company:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredCompanies.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Industry:</label>
              <div className="w-40 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
                {company.industry}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sector:</label>
              <div className="w-48 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
                {company.sector}
              </div>
            </div>
          </div>
        </div>

        {/* Company Description and SBTI Targets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Company Description</h3>
              <p className="text-gray-600 mb-4">{company.description}</p>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Top 3 Carbon Footprints:</h4>
                <ul className="space-y-1">
                  {company.topCarbonFootprints.map((footprint, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                      {footprint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {company.sbtiTargets && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Science Based Targets (SBTi)</h3>
                <p className="text-gray-600 mb-3">{company.sbtiTargets.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Near-term Target:</span>
                    <span className="font-medium">{company.sbtiTargets.nearTermTarget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Long-term Target:</span>
                    <span className="font-medium">{company.sbtiTargets.longTermTarget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Baseline Year:</span>
                    <span className="font-medium">{company.sbtiTargets.baselineYear}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frameworks Status */}
        <FrameworksStatus frameworks={company.frameworks} />
      </div>

      {/* Key ESG Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Carbon Footprint"
          value={(company.totalEmissions / 1000).toFixed(1)}
          unit="million tCO2e"
          change={-15.2}
          trend="down"
        />
        <MetricCard
          title="Energy Consumption"
          value={company.energyConsumption.toLocaleString()}
          unit="MWh"
          change={-8.5}
          trend="down"
        />
        <MetricCard
          title="Waste Generated"
          value={company.wasteGenerated.toString()}
          unit="tons"
          change={12.3}
          trend="up"
        />
      </div>

      {/* Emissions Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Emissions Trends (2019-2024)</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">As is (Scope 1,2,3 + Total)</SelectItem>
                <SelectItem value="scope1">Scope 1 Only</SelectItem>
                <SelectItem value="scope2">Scope 2 Only</SelectItem>
                <SelectItem value="scope1+2">Scope 1 + 2</SelectItem>
                <SelectItem value="scope3">Scope 3 Only</SelectItem>
                <SelectItem value="total">Total (Scope 1+2+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="#6b7280"
              label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [`${value} tCO2e`, name]}
            />
            <Legend />
            
            {selectedScope === 'all' && (
              <>
                <Bar dataKey="scope1" fill="#dc2626" name="Scope 1" />
                <Bar dataKey="scope2" fill="#ea580c" name="Scope 2" />
                <Bar dataKey="scope3" fill="#0d9488" name="Scope 3" />
                <Line type="monotone" dataKey="total" stroke="#1f2937" strokeWidth={3} name="Total" />
              </>
            )}
            {selectedScope === 'scope1' && <Bar dataKey="scope1" fill="#dc2626" name="Scope 1" />}
            {selectedScope === 'scope2' && <Bar dataKey="scope2" fill="#ea580c" name="Scope 2" />}
            {selectedScope === 'scope1+2' && <Bar dataKey="scope1+2" fill="#f59e0b" name="Scope 1+2" />}
            {selectedScope === 'scope3' && <Bar dataKey="scope3" fill="#0d9488" name="Scope 3" />}
            {selectedScope === 'total' && <Line type="monotone" dataKey="total" stroke="#1f2937" strokeWidth={3} name="Total" />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Scope 1 Reduction (2019-2024)</span>
              <span className="text-green-600 font-medium">-23%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Scope 2 Reduction (2019-2024)</span>
              <span className="text-green-600 font-medium">-26%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Scope 3 Reduction (2019-2024)</span>
              <span className="text-green-600 font-medium">-19%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
              <span className="text-gray-600">Implement renewable energy sources</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
              <span className="text-gray-600">Optimize supply chain emissions</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
              <span className="text-gray-600">Enhance employee engagement programs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
