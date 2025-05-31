
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Target, Users, Truck, Building, Zap, Factory } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useSupabaseScope3Data } from '@/hooks/useSupabaseScope3';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Scope3 = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('techcorp');
  const { data: scope3Data, isLoading } = useSupabaseScope3Data(selectedCompany);
  const { data: companies } = useSupabaseCompanies();

  const companyOptions = companies || [
    { id: 'techcorp', name: 'TechCorp Solutions', sector: 'Technology' },
    { id: 'amazon', name: 'Amazon', sector: 'Technology' },
    { id: 'microsoft', name: 'Microsoft', sector: 'Technology' },
    { id: 'tesla', name: 'Tesla', sector: 'Manufacturing' },
    { id: 'toyota', name: 'Toyota', sector: 'Manufacturing' }
  ];

  // Get latest year scope 3 emissions data
  const latestEmissions = scope3Data?.trendData?.[scope3Data.trendData.length - 1]?.emissions || 1600;
  
  // Process category data for charts
  const categoryData = scope3Data?.categoryData?.length > 0 ? scope3Data.categoryData.map(cat => ({
    category: cat.category,
    emissions: parseInt(cat.emissions),
    percentage: ((parseInt(cat.emissions) / latestEmissions) * 100).toFixed(1) + '%',
    color: getCategoryColor(cat.category),
    explanation: getCategoryExplanation(cat.category),
    businessContext: cat.insights || 'Business impact analysis pending'
  })) : getDefaultCategoryData();

  function getCategoryColor(category: string) {
    const colors = {
      'Purchased Goods & Services': '#3B82F6',
      'Business Travel': '#EF4444',
      'Use of Sold Products': '#10B981',
      'Employee Commuting': '#F59E0B',
      'Capital Goods': '#8B5CF6',
      'Investments': '#EC4899',
      'Upstream Leased Assets': '#06B6D4',
      'Fuel & Energy Related Activities': '#84CC16',
      'Processing of Sold Products': '#F97316',
      'Upstream Transportation': '#6366F1',
      'Downstream Transportation': '#14B8A6',
      'Downstream Leased Assets': '#F43F5E',
      'Waste Generated in Operations': '#A3A3A3',
      'End-of-life Treatment': '#64748B',
      'Franchises': '#9CA3AF'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  }

  function getCategoryExplanation(category: string) {
    const explanations = {
      'Purchased Goods & Services': 'IT equipment, software, cloud services that the company buys to run its business',
      'Business Travel': 'Flights, hotels, and transport when employees travel for meetings and conferences',
      'Use of Sold Products': 'Energy consumed when customers use company software applications or products',
      'Employee Commuting': 'Daily travel by employees from home to office and back',
      'Capital Goods': 'Long-term equipment like servers, office furniture, and building infrastructure',
      'Investments': 'Emissions from companies that the organization invests in or has partnerships with',
      'Upstream Leased Assets': 'Office buildings and data centers that the company rents from others',
      'Fuel & Energy Related Activities': 'Emissions from producing the electricity and fuel that the company uses',
      'Processing of Sold Products': 'Energy used when customers install and set up company software or products',
      'Upstream Transportation': 'Shipping and delivery of equipment and supplies to company offices',
      'Downstream Transportation': 'Delivery of company products to customers',
      'Downstream Leased Assets': 'Customer data centers and servers that run company software',
      'Waste Generated in Operations': 'Disposal and recycling of office waste, old computers, and electronic equipment',
      'End-of-life Treatment': 'What happens when customers dispose of hardware that used company software',
      'Franchises': 'Not applicable - company does not operate franchise locations'
    };
    return explanations[category as keyof typeof explanations] || 'Category-specific emissions in value chain';
  }

  function getDefaultCategoryData() {
    return [
      { category: 'Purchased Goods & Services', emissions: 480, percentage: '30%', color: '#3B82F6', explanation: 'IT equipment, software, cloud services', businessContext: 'Hardware procurement, software licensing' },
      { category: 'Business Travel', emissions: 180, percentage: '11%', color: '#EF4444', explanation: 'Employee business travel', businessContext: 'Client meetings, conferences' },
      { category: 'Use of Sold Products', emissions: 200, percentage: '13%', color: '#10B981', explanation: 'Customer use of products', businessContext: 'Customer operations' },
      { category: 'Employee Commuting', emissions: 150, percentage: '9%', color: '#F59E0B', explanation: 'Daily commuting', businessContext: 'Office commute patterns' },
      { category: 'Capital Goods', emissions: 120, percentage: '8%', color: '#8B5CF6', explanation: 'Long-term equipment', businessContext: 'Infrastructure investments' }
    ];
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading Scope 3 data...</div>
      </div>
    );
  }

  const totalEmissions = categoryData.reduce((sum, cat) => sum + cat.emissions, 0);
  const topCategory = categoryData.reduce((max, cat) => cat.emissions > max.emissions ? cat : max, categoryData[0]);

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

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-sm bg-white/80 border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scope 3 Emissions</CardTitle>
                <Truck className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmissions.toLocaleString()} tCO2e</div>
                <p className="text-xs text-gray-600">{categoryData.length} emission categories</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topCategory?.category?.split(' ')[0] || 'N/A'}</div>
                <p className="text-xs text-gray-600">{topCategory?.emissions?.toLocaleString() || 0} tCO2e ({topCategory?.percentage || '0%'})</p>
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
          {/* Pie Chart */}
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Scope 3 Emissions by Category</CardTitle>
              <CardDescription>Breakdown of value chain emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData.filter(cat => cat.emissions > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category.split(' ')[0]}: ${percentage}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="emissions"
                  >
                    {categoryData.filter(cat => cat.emissions > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} tCO2e`, 'Emissions']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Top Emission Categories</CardTitle>
              <CardDescription>Highest impact areas in the value chain</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    width={120} 
                    tick={{fontSize: 10}}
                    tickFormatter={(value) => value.split(' ')[0] + (value.split(' ')[1] ? ' ' + value.split(' ')[1] : '')}
                  />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} tCO2e`, 'Emissions']} />
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
            <CardDescription>All categories with business context and reduction opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categoryData.map((category, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      <Badge variant="secondary">{category.emissions.toLocaleString()} tCO2e ({category.percentage})</Badge>
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
                      <p className="text-sm text-red-700">Focus on low-carbon suppliers for goods and services</p>
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
                      <p className="text-sm text-blue-700">Develop energy-efficient solutions</p>
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
