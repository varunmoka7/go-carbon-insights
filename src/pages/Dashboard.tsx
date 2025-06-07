
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCompanies } from '@/hooks/useCompanies';
import { useClimateIntelligence } from '@/hooks/useClimateIntelligence';
import ClimatePerformanceDashboard from '@/components/ClimatePerformanceDashboard';
import { Leaf, Target, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'apple';
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: climateData, isLoading: climateLoading } = useClimateIntelligence(selectedCompany);

  if (companiesLoading || climateLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading climate intelligence...</p>
        </div>
      </div>
    );
  }

  if (!climateData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No climate data available for this company.</p>
      </div>
    );
  }

  const selectedCompanyData = companies?.find(c => c.id === selectedCompany);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="outline" className="px-4 py-2 bg-green-50 border-green-200">
            <Leaf className="h-4 w-4 mr-2 text-green-600" />
            Climate Intelligence Platform
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Climate Performance Dashboard
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto mb-6">
          Strategic climate intelligence and decarbonization pathway management for enterprise sustainability leadership.
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            <span>Science-Based Targets</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span>Net Zero Pathway</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-purple-600" />
            <span>Carbon Portfolio</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Company:</label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Climate Performance Dashboard */}
      <ClimatePerformanceDashboard 
        climateMetrics={climateData.climateMetrics}
        carbonProjects={climateData.carbonProjects}
        companyName={selectedCompanyData?.name || 'Selected Company'}
      />

      {/* Company Context */}
      {selectedCompanyData && (
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Climate Strategy Context</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{selectedCompanyData.name}</h4>
              <p className="text-gray-700 mb-4">
                Leading {selectedCompanyData.sector || selectedCompanyData.industry} company demonstrating 
                strategic climate leadership through comprehensive decarbonization initiatives and 
                science-based target implementation.
              </p>
              <div className="space-y-2">
                <p><span className="font-medium">Industry:</span> {selectedCompanyData.industry}</p>
                <p><span className="font-medium">Sector:</span> {selectedCompanyData.sector}</p>
                <p><span className="font-medium">Climate Risk Profile:</span> {climateData.company.climateRiskScore}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Zero Target:</span>
                <Badge variant="secondary">{climateData.company.netZeroTargetYear}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">SBTi Status:</span>
                <Badge variant={climateData.company.sbtiStatus === 'approved' ? 'default' : 'secondary'}>
                  {climateData.company.sbtiStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Renewable Energy:</span>
                <span className="text-green-600 font-semibold">{climateData.company.renewableEnergyPercent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Fleet Electrification:</span>
                <span className="text-blue-600 font-semibold">{climateData.company.fleetElectrification}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
