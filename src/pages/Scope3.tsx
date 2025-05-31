
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Target, Users, Truck, Building, Zap, Factory } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useScope3Data } from '@/hooks/useScope3Data';
import { useSupabaseSBTIPathway } from '@/hooks/useSupabaseSBTI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { enhancedCompanies } from '@/data/enhancedMockData';

const Scope3 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: scope3Data, isLoading } = useScope3Data(selectedCompany);
  const { data: sbtiPathway } = useSupabaseSBTIPathway(selectedCompany);

  const company = enhancedCompanies.find(c => c.id === selectedCompany);

  // Enhanced Scope 3 categories with layman explanations for TechCorp
  const scope3CategoriesWithExplanations = [
    {
      category: 'Purchased Goods & Services',
      emissions: '480',
      percentage: '30%',
      color: '#3B82F6',
      explanation: 'IT equipment, software, cloud services that TechCorp buys to run its business',
      businessContext: 'Hardware procurement, software licensing, cloud infrastructure costs'
    },
    {
      category: 'Business Travel',
      emissions: '180',
      percentage: '11%',
      color: '#EF4444',
      explanation: 'Flights, hotels, and transport when employees travel for meetings and conferences',
      businessContext: 'Client meetings, conferences, training, sales activities'
    },
    {
      category: 'Use of Sold Products',
      emissions: '200',
      percentage: '13%',
      color: '#10B981',
      explanation: 'Energy consumed when customers use TechCorp software applications',
      businessContext: 'Customer servers running our software, data processing, cloud computing'
    },
    {
      category: 'Employee Commuting',
      emissions: '150',
      percentage: '9%',
      color: '#F59E0B',
      explanation: 'Daily travel by employees from home to office and back',
      businessContext: 'Daily office commute, parking, public transport usage'
    },
    {
      category: 'Capital Goods',
      emissions: '120',
      percentage: '8%',
      color: '#8B5CF6',
      explanation: 'Long-term equipment like servers, office furniture, and building infrastructure',
      businessContext: 'Office setup, data center equipment, long-term IT infrastructure'
    },
    {
      category: 'Investments',
      emissions: '112',
      percentage: '7%',
      color: '#EC4899',
      explanation: 'Emissions from companies that TechCorp invests in or has partnerships with',
      businessContext: 'Portfolio companies, joint ventures, strategic partnerships'
    },
    {
      category: 'Upstream Leased Assets',
      emissions: '96',
      percentage: '6%',
      color: '#06B6D4',
      explanation: 'Office buildings and data centers that TechCorp rents from others',
      businessContext: 'Leased office spaces, rented data center facilities'
    },
    {
      category: 'Fuel & Energy Related Activities',
      emissions: '80',
      percentage: '5%',
      color: '#84CC16',
      explanation: 'Emissions from producing the electricity and fuel that TechCorp uses',
      businessContext: 'Electricity generation, fuel production for company vehicles'
    },
    {
      category: 'Processing of Sold Products',
      emissions: '80',
      percentage: '5%',
      color: '#F97316',
      explanation: 'Energy used when customers install and set up TechCorp software',
      businessContext: 'Software implementation, system integration, initial setup'
    },
    {
      category: 'Upstream Transportation',
      emissions: '64',
      percentage: '4%',
      color: '#6366F1',
      explanation: 'Shipping and delivery of equipment and supplies to TechCorp offices',
      businessContext: 'Hardware delivery, office supplies shipping, equipment transport'
    },
    {
      category: 'Downstream Transportation',
      emissions: '40',
      percentage: '3%',
      color: '#14B8A6',
      explanation: 'Delivery of TechCorp products (software) to customers',
      businessContext: 'Software distribution, digital delivery infrastructure'
    },
    {
      category: 'Downstream Leased Assets',
      emissions: '32',
      percentage: '2%',
      color: '#F43F5E',
      explanation: 'Customer data centers and servers that run TechCorp software',
      businessContext: 'Customer-operated facilities using our solutions'
    },
    {
      category: 'Waste Generated in Operations',
      emissions: '32',
      percentage: '2%',
      color: '#A3A3A3',
      explanation: 'Disposal and recycling of office waste, old computers, and electronic equipment',
      businessContext: 'E-waste disposal, office recycling, equipment end-of-life'
    },
    {
      category: 'End-of-life Treatment',
      emissions: '24',
      percentage: '2%',
      color: '#64748B',
      explanation: 'What happens when customers dispose of hardware that used TechCorp software',
      businessContext: 'Customer hardware disposal, software decommissioning'
    },
    {
      category: 'Franchises',
      emissions: '0',
      percentage: '0%',
      color: '#9CA3AF',
      explanation: 'Not applicable - TechCorp does not operate franchise locations',
      businessContext: 'N/A - Direct business model only'
    }
  ];

  // SBTI pathway data for the chart
  const sbtiChartData = sbtiPathway || [
    { year: 2020, target: 1850, actual: 1850, status: 'baseline' },
    { year: 2021, target: 1776, actual: 1700, status: 'ahead' },
    { year: 2022, target: 1702, actual: 1600, status: 'ahead' },
    { year: 2023, target: 1628, actual: 1500, status: 'ahead' },
    { year: 2024, target: 1554, actual: null, status: 'projected' },
    { year: 2025, target: 1480, actual: null, status: 'projected' },
    { year: 2026, target: 1406, actual: null, status: 'projected' },
    { year: 2027, target: 1332, actual: null, status: 'projected' },
    { year: 2028, target: 1258, actual: null, status: 'projected' },
    { year: 2029, target: 1184, actual: null, status: 'projected' },
    { year: 2030, target: 925, actual: null, status: 'target' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading Scope 3 data...</div>
      </div>
    );
  }

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
                <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Scope 3 Emissions</h1>
                  <p className="text-gray-600">Value Chain & Supply Chain Emissions</p>
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
                  {enhancedCompanies.map((comp) => (
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

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-sm bg-white/80 border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scope 3 Emissions</CardTitle>
                <Truck className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,600 tCO2e</div>
                <p className="text-xs text-gray-600">15 emission categories</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Purchased Goods</div>
                <p className="text-xs text-gray-600">480 tCO2e (30%)</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reduction Potential</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30%</div>
                <p className="text-xs text-gray-600">By 2030 target</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scope 3 Categories Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pie Chart with Labels */}
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Scope 3 Emissions by Category</CardTitle>
              <CardDescription>All 15 GHG Protocol categories with emissions breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={scope3CategoriesWithExplanations.filter(cat => parseInt(cat.emissions) > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="emissions"
                  >
                    {scope3CategoriesWithExplanations.filter(cat => parseInt(cat.emissions) > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories Bar Chart */}
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Top Emission Categories</CardTitle>
              <CardDescription>Highest impact areas for TechCorp's value chain</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={scope3CategoriesWithExplanations.slice(0, 8)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={120} tick={{fontSize: 10}} />
                  <Tooltip formatter={(value) => [`${value} tCO2e`, 'Emissions']} />
                  <Bar dataKey="emissions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Categories Breakdown */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Complete Scope 3 Categories Analysis</CardTitle>
            <CardDescription>All 15 categories with business context and reduction opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {scope3CategoriesWithExplanations.map((category, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      <Badge variant="secondary">{category.emissions} tCO2e ({category.percentage})</Badge>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Simple Explanation:</p>
                      <p className="text-sm text-gray-600">{category.explanation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Business Context:</p>
                      <p className="text-sm text-gray-600">{category.businessContext}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SBTI Pathway Analysis */}
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

        {/* Action Items */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Priority Action Areas</CardTitle>
            <CardDescription>Key opportunities to reduce Scope 3 emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">High Impact Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <Factory className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-red-800">Sustainable Procurement</p>
                      <p className="text-sm text-red-700">Focus on low-carbon suppliers for IT hardware and services</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-orange-800">Travel Policy</p>
                      <p className="text-sm text-orange-700">Implement virtual-first meetings and sustainable travel options</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Medium Impact Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Building className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-green-800">Green Buildings</p>
                      <p className="text-sm text-green-700">Choose energy-efficient office spaces and data centers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-blue-800">Product Efficiency</p>
                      <p className="text-sm text-blue-700">Develop energy-efficient software solutions</p>
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

export default Scope3;
