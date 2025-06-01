
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, TrendingDown, Building2, Target, Zap, Factory } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useCompanies } from '@/hooks/useCompanies';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'techcorp';
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  
  const { data: companies, isLoading } = useCompanies();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const selectedCompanyData = companies?.find(c => c.id === selectedCompany);

  const emissionsData = [
    { year: '2020', scope1: 1200, scope2: 800, scope3: 2500 },
    { year: '2021', scope1: 1150, scope2: 750, scope3: 2300 },
    { year: '2022', scope1: 1100, scope2: 700, scope3: 2100 },
    { year: '2023', scope1: 1000, scope2: 650, scope3: 1900 },
    { year: '2024', scope1: 950, scope2: 600, scope3: 1750 }
  ];

  const pieData = [
    { name: 'Scope 1', value: 950, color: '#dc2626' },
    { name: 'Scope 2', value: 600, color: '#ea580c' },
    { name: 'Scope 3', value: 1750, color: '#0d9488' }
  ];

  const totalEmissions = emissionsData[emissionsData.length - 1];
  const total = totalEmissions.scope1 + totalEmissions.scope2 + totalEmissions.scope3;
  const previousTotal = emissionsData[emissionsData.length - 2]?.scope1 + emissionsData[emissionsData.length - 2]?.scope2 + emissionsData[emissionsData.length - 2]?.scope3;
  const reduction = ((previousTotal - total) / previousTotal * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Emissions Dashboard</h1>
        <div className="flex items-center space-x-4">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()} tCO2e</div>
            <p className="text-xs text-muted-foreground">Current year total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YoY Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-{reduction}%</div>
            <p className="text-xs text-muted-foreground">Compared to last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scope 1</CardTitle>
            <Factory className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.scope1} tCO2e</div>
            <p className="text-xs text-muted-foreground">Direct emissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scope 2</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.scope2} tCO2e</div>
            <p className="text-xs text-muted-foreground">Energy indirect</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Emissions Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Trend by Scope</CardTitle>
            <CardDescription>Historical emissions data showing progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scope1" stroke="#dc2626" strokeWidth={2} name="Scope 1" />
                <Line type="monotone" dataKey="scope2" stroke="#ea580c" strokeWidth={2} name="Scope 2" />
                <Line type="monotone" dataKey="scope3" stroke="#0d9488" strokeWidth={2} name="Scope 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emissions Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Current Year Distribution</CardTitle>
            <CardDescription>Breakdown of emissions by scope for 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Annual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Emissions Comparison</CardTitle>
          <CardDescription>Year-over-year comparison across all scopes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={emissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scope1" stackId="a" fill="#dc2626" name="Scope 1" />
              <Bar dataKey="scope2" stackId="a" fill="#ea580c" name="Scope 2" />
              <Bar dataKey="scope3" stackId="a" fill="#0d9488" name="Scope 3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Company Information */}
      {selectedCompanyData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedCompanyData.name}</h3>
                <p className="text-gray-600 mb-4">{selectedCompanyData.description}</p>
                <div className="space-y-2">
                  <p><span className="font-medium">Industry:</span> {selectedCompanyData.industry}</p>
                  <p><span className="font-medium">Sector:</span> {selectedCompanyData.sector}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Total Carbon Footprint:</span> {selectedCompanyData.carbon_footprint?.toLocaleString()} tCO2e</p>
                <p><span className="font-medium">Energy Consumption:</span> {selectedCompanyData.energy_consumption?.toLocaleString()} MWh</p>
                <p><span className="font-medium">Renewable Energy:</span> {selectedCompanyData.renewable_energy_percentage}%</p>
                <p><span className="font-medium">Waste Generated:</span> {selectedCompanyData.waste_generated?.toLocaleString()} tons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
