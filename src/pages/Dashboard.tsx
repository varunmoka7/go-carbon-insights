
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '@/components/MetricCard';
import EmissionChart from '@/components/EmissionChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCompanies, useCompany } from '@/hooks/useCompanies';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [selectedScope, setSelectedScope] = useState('all');
  const { data: companies = [] } = useCompanies();
  const { data: company, isLoading } = useCompany(selectedCompany);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

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
        return company.emissionsData;
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
        
        {/* Company Selection */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Company:</label>
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
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Industry:</label>
            <div className="w-48 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
              {company.industry || 'N/A'}
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Company Name</span>
              <p className="font-medium text-gray-900">{company.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Industry</span>
              <p className="font-medium text-gray-900">{company.industry || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Carbon Footprint</span>
              <p className="font-medium text-gray-900">{company.carbonFootprint} tCO2e</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Reporting Year</span>
              <p className="font-medium text-gray-900">{company.reportingYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key ESG Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Emissions"
          value={company.totalEmissions.toLocaleString()}
          unit="tCO2e"
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
          <h3 className="text-lg font-semibold text-gray-900">Emissions Trends (Last 5 Years)</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="scope1">Scope 1 Only</SelectItem>
                <SelectItem value="scope2">Scope 2 Only</SelectItem>
                <SelectItem value="scope3">Scope 3 Only</SelectItem>
                <SelectItem value="total">Total Emissions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <EmissionChart
          data={getChartData()}
          title=""
          height={400}
          selectedScope={selectedScope}
        />
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Scope 1 Reduction</span>
              <span className="text-green-600 font-medium">-25%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Scope 2 Reduction</span>
              <span className="text-green-600 font-medium">-25%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Scope 3 Reduction</span>
              <span className="text-green-600 font-medium">-33%</span>
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
