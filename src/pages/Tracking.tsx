
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '@/components/MetricCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, Factory, Zap, Truck } from 'lucide-react';

const Tracking = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');

  const companies = [
    { id: 'techcorp', name: 'TechCorp Solutions' },
    { id: 'greenmanuf', name: 'Green Manufacturing Co.' },
    { id: 'sustaintech', name: 'SustainTech Industries' }
  ];

  const emissionScopes = [
    {
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'Direct greenhouse gas emissions from sources owned or controlled by the company, including combustion of fossil fuels, company vehicles, and manufacturing processes.',
      icon: Factory,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      link: '/scope1'
    },
    {
      scope: 'Scope 2',
      title: 'Indirect - Purchased Energy',
      description: 'Indirect emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the company.',
      icon: Zap,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      link: '/scope2'
    },
    {
      scope: 'Scope 3',
      title: 'Indirect - Value Chain',
      description: 'All other indirect emissions that occur in the value chain, including purchased goods, business travel, employee commuting, and waste disposal.',
      icon: Truck,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600',
      link: '/scope3'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Emissions Tracking</h1>
        
        {/* Company Selection */}
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Select Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <MetricCard
            title="Carbon Footprint"
            value="3,100"
            unit="tCO2e"
            change={-15.2}
            trend="down"
          />
          <MetricCard
            title="Energy Consumption"
            value="12,450"
            unit="MWh"
            change={-8.3}
            trend="down"
          />
          <MetricCard
            title="Waste Generated"
            value="245"
            unit="tons"
            change={-12.1}
            trend="down"
          />
        </div>
      </div>

      {/* Emissions Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emissions Overview</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {emissionScopes.map((scope, index) => (
            <div key={index} className={`${scope.color} rounded-lg border p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${scope.color} flex items-center justify-center`}>
                  <scope.icon className={`h-6 w-6 ${scope.iconColor}`} />
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${scope.color} ${scope.iconColor}`}>
                  {scope.scope}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{scope.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{scope.description}</p>
              
              <Link to={scope.link}>
                <Button variant="outline" className="w-full justify-between group">
                  View Details
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <Factory className="h-4 w-4 mr-2" />
            Add New Facility
          </Button>
          <Button variant="outline" className="justify-start">
            <Zap className="h-4 w-4 mr-2" />
            Update Energy Data
          </Button>
          <Button variant="outline" className="justify-start">
            <Truck className="h-4 w-4 mr-2" />
            Log Transportation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
