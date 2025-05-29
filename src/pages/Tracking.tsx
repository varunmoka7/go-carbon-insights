
import React, { useState } from 'react';
import { Factory, Zap, Truck, Target, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompany } from '@/hooks/useCompanies';
import { useSBTITargets } from '@/hooks/useSBTITargets';

const Tracking = () => {
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const [reportingYear, setReportingYear] = useState('2024');
  const { data: company } = useCompany(selectedCompany);
  const { data: sbtiTargets } = useSBTITargets(selectedCompany);

  if (!company) {
    return <div className="text-center text-gray-600">Company not found</div>;
  }

  // Get data for selected reporting year
  const yearData = company.emissionsData.find(data => data.year.toString() === reportingYear) || company.emissionsData[company.emissionsData.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Tracking Dashboard</h1>
              <p className="text-gray-600">Monitor and track your company's carbon performance</p>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">Select Company:</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-64 backdrop-blur-sm bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp Industries</SelectItem>
                    <SelectItem value="greenmanufacturing">Green Manufacturing Co.</SelectItem>
                    <SelectItem value="retailgiant">Retail Giant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="ml-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">Reporting Year:</label>
              <Select value={reportingYear} onValueChange={setReportingYear}>
                <SelectTrigger className="w-32 backdrop-blur-sm bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {company.emissionsData.map(data => (
                    <SelectItem key={data.year} value={data.year.toString()}>
                      {data.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Carbon Footprint</p>
                <p className="text-3xl font-bold text-gray-900">
                  {((yearData.scope1 + yearData.scope2 + yearData.scope3) / 1000).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Million tCO2e</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Factory className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Energy Consumption</p>
                <p className="text-3xl font-bold text-gray-900">{company.energyConsumption.toLocaleString()}</p>
                <p className="text-sm text-gray-500">MWh</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Generated</p>
                <p className="text-3xl font-bold text-gray-900">{company.wasteGenerated.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Tons</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Emissions Overview */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Emissions Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-lg bg-white/70 border-white/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 1</CardTitle>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Factory className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yearData.scope1.toLocaleString()}</div>
                <p className="text-xs text-gray-600">tCO2e</p>
                <CardDescription className="mt-2">
                  Direct emissions from owned or controlled sources including manufacturing processes and company vehicles.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/70 border-white/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 2</CardTitle>
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yearData.scope2.toLocaleString()}</div>
                <p className="text-xs text-gray-600">tCO2e</p>
                <CardDescription className="mt-2">
                  Indirect emissions from purchased electricity, steam, heating and cooling consumed by the company.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/70 border-white/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 3</CardTitle>
                <div className="h-8 w-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yearData.scope3.toLocaleString()}</div>
                <p className="text-xs text-gray-600">tCO2e</p>
                <CardDescription className="mt-2">
                  All other indirect emissions in the value chain including supply chain, business travel, and waste.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Science Based Targets */}
        {company.sbtiTargets && (
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Science Based Targets</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">SBTi Verified</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Target Description</h3>
                <p className="text-gray-600 text-sm">{company.sbtiTargets.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium">Near-term Target:</span>
                  <span className="text-sm text-gray-600">{company.sbtiTargets.nearTermTarget}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium">Long-term Target:</span>
                  <span className="text-sm text-gray-600">{company.sbtiTargets.longTermTarget}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium">Baseline Year:</span>
                  <span className="text-sm text-gray-600">{company.sbtiTargets.baselineYear}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 backdrop-blur-sm bg-white/80 hover:bg-white/90">
              <div className="text-left">
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-gray-500">Create compliance report</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 backdrop-blur-sm bg-white/80 hover:bg-white/90">
              <div className="text-left">
                <div className="font-medium">Set Targets</div>
                <div className="text-sm text-gray-500">Define reduction goals</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 backdrop-blur-sm bg-white/80 hover:bg-white/90">
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-gray-500">Detailed insights</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 backdrop-blur-sm bg-white/80 hover:bg-white/90">
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-gray-500">Download CSV/PDF</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Sources & References */}
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sources & References</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
              <div>
                <span className="text-sm font-medium">Company Sustainability Report</span>
                <p className="text-xs text-gray-500">Annual ESG disclosures</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
              <div>
                <span className="text-sm font-medium">CDP Climate Disclosure</span>
                <p className="text-xs text-gray-500">Carbon disclosure data</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
              <div>
                <span className="text-sm font-medium">SBTi Database</span>
                <p className="text-xs text-gray-500">Science-based targets</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
              <div>
                <span className="text-sm font-medium">GHG Protocol</span>
                <p className="text-xs text-gray-500">Methodology standards</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
