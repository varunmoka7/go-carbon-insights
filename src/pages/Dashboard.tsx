
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
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Emissions Overview Dashboard</h1>
        <p className="text-lg text-gray-600 mb-6">Comprehensive carbon footprint analysis and trends</p>
        
        {/* Company Selection with Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-gray-800 min-w-fit">Company:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-10"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64 h-10">
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
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-gray-800 min-w-fit">Industry:</label>
              <div className="w-40 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700">
                {company.industry}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-gray-800 min-w-fit">Sector:</label>
              <div className="w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700">
                {company.sector}
              </div>
            </div>
          </div>
        </div>

        {/* Company Description and SBTI Targets */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Overview</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Description</h3>
                <p className="text-gray-600 leading-relaxed text-base">{company.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Top 3 Carbon Footprints:</h4>
                <ul className="space-y-2">
                  {company.topCarbonFootprints.map((footprint, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                      <span className="font-medium">{footprint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {company.sbtiTargets && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Science Based Targets (SBTi)</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{company.sbtiTargets.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Near-term Target:</span>
                    <span className="font-semibold text-blue-700">{company.sbtiTargets.nearTermTarget}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Long-term Target:</span>
                    <span className="font-semibold text-blue-700">{company.sbtiTargets.longTermTarget}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Baseline Year:</span>
                    <span className="font-semibold text-blue-700">{company.sbtiTargets.baselineYear}</span>
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
      <div className="grid md:grid-cols-4 gap-6 mb-8">
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
        <MetricCard
          title="Renewable Energy"
          value="68.5"
          unit="%"
          change={15.8}
          trend="up"
        />
      </div>

      {/* Emissions Trends Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Emissions Trends (2019-2024)</h3>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-gray-700">Chart View:</label>
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-56 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes (Combined View)</SelectItem>
                <SelectItem value="scope1">Scope 1 Only</SelectItem>
                <SelectItem value="scope2">Scope 2 Only</SelectItem>
                <SelectItem value="scope1+2">Scope 1 + 2 Combined</SelectItem>
                <SelectItem value="scope3">Scope 3 Only</SelectItem>
                <SelectItem value="total">Total Emissions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              fontSize={14}
              fontWeight={500}
              label={{ value: 'Year', position: 'insideBottom', offset: -8, style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={14}
              fontWeight={500}
              label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500
              }}
              formatter={(value, name) => [`${value} tCO2e`, name]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '16px', paddingTop: '24px', fontWeight: 500 }}
            />
            
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
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Key Achievements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Scope 1 Reduction (2019-2024)</span>
              <span className="text-green-600 font-bold text-lg">-23%</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Scope 2 Reduction (2019-2024)</span>
              <span className="text-green-600 font-bold text-lg">-26%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 font-medium">Scope 3 Reduction (2019-2024)</span>
              <span className="text-green-600 font-bold text-lg">-19%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-3"></div>
              <span className="text-gray-600 font-medium">Implement renewable energy sources</span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-3"></div>
              <span className="text-gray-600 font-medium">Optimize supply chain emissions</span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-3"></div>
              <span className="text-gray-600 font-medium">Enhance employee engagement programs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
