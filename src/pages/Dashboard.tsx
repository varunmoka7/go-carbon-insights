
import React, { useState } from 'react';
import MetricCard from '@/components/MetricCard';
import EmissionChart from '@/components/EmissionChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const [selectedSector, setSelectedSector] = useState('technology');
  const [selectedIndustry, setSelectedIndustry] = useState('software');

  const emissionsData = [
    { year: '2019', scope1: 1200, scope2: 800, scope3: 2400 },
    { year: '2020', scope1: 1100, scope2: 750, scope3: 2200 },
    { year: '2021', scope1: 1000, scope2: 700, scope3: 2000 },
    { year: '2022', scope1: 950, scope2: 650, scope3: 1800 },
    { year: '2023', scope1: 900, scope2: 600, scope3: 1600 }
  ];

  const companyDetails = {
    name: 'TechCorp Solutions',
    sector: 'Technology',
    industry: 'Software Development',
    reportingYear: '2023'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Emissions Overview Dashboard</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sector:</label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Industry:</label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="hardware">Hardware Manufacturing</SelectItem>
                <SelectItem value="consulting">IT Consulting</SelectItem>
                <SelectItem value="cloud">Cloud Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Company Name</span>
              <p className="font-medium text-gray-900">{companyDetails.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Sector</span>
              <p className="font-medium text-gray-900">{companyDetails.sector}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Industry</span>
              <p className="font-medium text-gray-900">{companyDetails.industry}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Reporting Year</span>
              <p className="font-medium text-gray-900">{companyDetails.reportingYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key ESG Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Emissions"
          value="3,100"
          unit="tCO2e"
          change={-15.2}
          trend="down"
        />
        <MetricCard
          title="Emissions Intensity"
          value="0.18"
          unit="tCO2e/Revenue"
          change={-8.5}
          trend="down"
        />
        <MetricCard
          title="Target Achievement"
          value="87"
          unit="%"
          change={12.3}
          trend="up"
        />
      </div>

      {/* Emissions Trends Chart */}
      <EmissionChart
        data={emissionsData}
        title="Emissions Trends (Last 5 Years)"
        height={400}
      />

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
