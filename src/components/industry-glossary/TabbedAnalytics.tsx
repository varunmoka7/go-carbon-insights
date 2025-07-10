import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TabbedAnalyticsProps {
  taxonomyData: any[];
}

export const TabbedAnalytics = ({ taxonomyData }: TabbedAnalyticsProps) => {
  // Mock data as specified in requirements
  const emissionsArchetypesData = [
    { name: 'Financial Emissions', value: 15, color: '#FF6B6B' },
    { name: 'Scope 2-heavy', value: 18, color: '#4ECDC4' },
    { name: 'Transport Intensive', value: 14, color: '#45B7D1' },
    { name: 'Operational Efficiency', value: 16, color: '#96CEB4' },
    { name: 'Upstream-heavy', value: 13, color: '#FECA57' },
    { name: 'Lifecycle-dependent', value: 12, color: '#FF9FF3' },
    { name: 'User-phase Dominant', value: 8, color: '#54A0FF' },
    { name: 'Offset-focused', value: 4, color: '#5F27CD' }
  ];

  const sectorsAnalyticsData = [
    { name: 'Manufacturing', companies: 35, avgEmissions: 2840, scopeAlignment: 3 },
    { name: 'IT & Tech', companies: 28, avgEmissions: 890, scopeAlignment: 3 },
    { name: 'Energy', companies: 22, avgEmissions: 4200, scopeAlignment: 3 },
    { name: 'Financial', companies: 18, avgEmissions: 320, scopeAlignment: 3 },
    { name: 'Transport', companies: 16, avgEmissions: 1950, scopeAlignment: 2 },
    { name: 'Healthcare', companies: 14, avgEmissions: 750, scopeAlignment: 2 },
    { name: 'Retail', companies: 12, avgEmissions: 580, scopeAlignment: 2 },
    { name: 'Construction', companies: 10, avgEmissions: 1200, scopeAlignment: 1 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            {`${payload[0].dataKey}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <Tabs defaultValue="industries" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="industries" className="font-medium">Industries Overview</TabsTrigger>
          <TabsTrigger value="sectors" className="font-medium">Sectors Analytics</TabsTrigger>
          <TabsTrigger value="archetypes" className="font-medium">Emissions Archetypes</TabsTrigger>
        </TabsList>

        {/* Industries Overview Tab */}
        <TabsContent value="industries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Industry Count by Emissions Archetype</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={emissionsArchetypesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Sectors by Industry Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorsAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="companies" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sectors Analytics Tab */}
        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Sectors by Industry Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorsAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="companies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">GHG Protocol Scope Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorsAnalyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis domain={[0, 3]} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="scopeAlignment" fill="#1F2937" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-600 mt-2">
                  Coverage score: 3 = All scopes aligned, 0 = No alignment
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emissions Archetypes Tab */}
        <TabsContent value="archetypes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Industries per Archetype</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={emissionsArchetypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emissionsArchetypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">SBTi Pathways per Archetype</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emissionsArchetypesData.slice(0, 6).map((archetype, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border-l-4 bg-gray-50 rounded-r"
                    style={{ borderLeftColor: archetype.color }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{archetype.name}</p>
                      <p className="text-xs text-gray-600">Science-based pathway aligned</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {archetype.value} industries
                    </span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>SBTi Framework:</strong> Science Based Targets initiative provides companies with a clearly-defined path to reduce emissions in line with Paris Agreement goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};