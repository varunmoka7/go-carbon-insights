
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Target, Users, Building, Zap, Factory, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useSupabaseSBTIPathway } from '@/hooks/useSupabaseSBTI';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analysis = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: companies } = useSupabaseCompanies();
  const { data: sbtiPathway } = useSupabaseSBTIPathway(selectedCompany);

  // SBTI pathway data for the chart
  const sbtiChartData = sbtiPathway?.length > 0 ? sbtiPathway.map(item => ({
    year: item.year,
    target: item.target_emissions,
    actual: item.actual_emissions,
    status: item.actual_emissions ? 'actual' : 'projected'
  })) : [
    { year: 2020, target: 1850, actual: 1850, status: 'baseline' },
    { year: 2021, target: 1776, actual: 1700, status: 'ahead' },
    { year: 2022, target: 1702, actual: 1600, status: 'ahead' },
    { year: 2023, target: 1628, actual: 1500, status: 'ahead' },
    { year: 2024, target: 1554, actual: null, status: 'projected' },
    { year: 2025, target: 1480, actual: null, status: 'projected' },
    { year: 2030, target: 925, actual: null, status: 'target' }
  ];

  const companyOptions = companies || [
    { id: 'techcorp', name: 'TechCorp Solutions', sector: 'Technology' },
    { id: 'amazon', name: 'Amazon', sector: 'Technology' },
    { id: 'microsoft', name: 'Microsoft', sector: 'Technology' },
    { id: 'tesla', name: 'Tesla', sector: 'Manufacturing' },
    { id: 'toyota', name: 'Toyota', sector: 'Manufacturing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/tracking')}
                className="hover:bg-white/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Emissions Analysis</h1>
                  <p className="text-gray-600">Comprehensive carbon performance analysis and insights</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">Select Company:</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-64 backdrop-blur-sm bg-white/80 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{comp.name}</span>
                        <span className="text-xs text-gray-500">{comp.sector}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* SBTI Pathway Analysis - Moved from Scope 3 */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Science-Based Targets Pathway</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">SBTi Committed</Badge>
            </CardTitle>
            <CardDescription>
              Scope 1+2 emissions trajectory towards 2030 target (50% reduction from 2020 baseline)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sbtiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Emissions (tCO2e)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    `${value?.toLocaleString()} tCO2e`, 
                    name === 'target' ? 'SBTi Target Path' : 'Actual Emissions'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="SBTi Target Path"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Actual Emissions"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800">Current Progress</span>
                </div>
                <p className="text-sm text-green-700">
                  35% reduction achieved vs 50% target by 2030. Company is ahead of schedule.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-800">2030 Target</span>
                </div>
                <p className="text-sm text-blue-700">
                  Reduce Scope 1+2 emissions to 925 tCO2e (50% reduction from 2020 baseline).
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold text-purple-800">Long-term Goal</span>
                </div>
                <p className="text-sm text-purple-700">
                  Achieve net-zero emissions across all scopes by 2050.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emissions Performance Dashboard */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Performance Summary</CardTitle>
              <CardDescription>Key performance indicators and benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Scope 1 & 2 Reduction</span>
                  </div>
                  <span className="text-green-700 font-bold">35%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Scope 3 Reduction</span>
                  </div>
                  <span className="text-yellow-700 font-bold">22%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Overall Target Achievement</span>
                  </div>
                  <span className="text-blue-700 font-bold">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Sector Benchmarking</CardTitle>
              <CardDescription>Performance compared to industry peers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emissions Intensity</span>
                    <span>Better than 85% of peers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Renewable Energy Adoption</span>
                    <span>Above industry average</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target Ambition</span>
                    <span>Science-based targets set</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Key Insights & Recommendations</CardTitle>
            <CardDescription>AI-powered analysis of emission patterns and opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Opportunities</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-green-800">Accelerate Scope 3 Reductions</p>
                      <p className="text-sm text-green-700">Focus on supply chain engagement and sustainable procurement</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-blue-800">Energy Efficiency</p>
                      <p className="text-sm text-blue-700">Additional 15% reduction potential through smart building systems</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Risk Areas</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-orange-800">Supply Chain Emissions</p>
                      <p className="text-sm text-orange-700">Monitor supplier sustainability to avoid scope 3 increases</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <Factory className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-red-800">Operational Growth</p>
                      <p className="text-sm text-red-700">Ensure emissions don't scale with business expansion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;
