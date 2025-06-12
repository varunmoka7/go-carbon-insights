
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const FinancialInvestmentTracker = () => {
  const investmentAllocation = [
    { name: 'Supplier Programs', value: 35, amount: 3500000 },
    { name: 'Technology Innovation', value: 25, amount: 2500000 },
    { name: 'Operational Changes', value: 20, amount: 2000000 },
    { name: 'Carbon Removal', value: 15, amount: 1500000 },
    { name: 'Measurement Systems', value: 5, amount: 500000 }
  ];

  const roiProjections = [
    { timeframe: 'Year 1', savings: 500000, investment: 2000000, roi: -1500000 },
    { timeframe: 'Year 3', savings: 1800000, investment: 4000000, roi: -2200000 },
    { timeframe: 'Year 5', savings: 3500000, investment: 6000000, roi: -2500000 },
    { timeframe: 'Year 7', savings: 5200000, investment: 8000000, roi: -2800000 },
    { timeframe: 'Year 10', savings: 8500000, investment: 10000000, roi: -1500000 }
  ];

  const quarterlySpending = [
    { quarter: 'Q1 2024', budget: 2500000, actual: 2200000, variance: -300000 },
    { quarter: 'Q2 2024', budget: 2500000, actual: 2650000, variance: 150000 },
    { quarter: 'Q3 2024', budget: 2500000, actual: 2400000, variance: -100000 },
    { quarter: 'Q4 2024', budget: 2500000, actual: 2750000, variance: 250000 }
  ];

  const colors = ['#14b8a6', '#0891b2', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Investment Framework</h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Investment Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Investment Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investmentAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {investmentAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `$${investmentAllocation.find(item => item.name === name)?.amount.toLocaleString()}`,
                    'Investment'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {investmentAllocation.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium">${(item.amount / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Projections */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Projections Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeframe" />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Cumulative Savings"
                />
                <Line 
                  type="monotone" 
                  dataKey="investment" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Cumulative Investment"
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="Net ROI"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Budget vs Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Budget Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, '']}
              />
              <Bar dataKey="budget" fill="#94a3b8" name="Budget" />
              <Bar dataKey="actual" fill="#14b8a6" name="Actual Spending" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {quarterlySpending.map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">{item.quarter}</div>
                <div className={`text-lg font-bold ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.variance >= 0 ? '+' : ''}${(item.variance / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-500">variance</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInvestmentTracker;
