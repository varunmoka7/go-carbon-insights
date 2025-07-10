import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Crown, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Trophy, 
  Target 
} from 'lucide-react';

interface TabbedAnalyticsProps {
  taxonomyData: any[];
}

export const TabbedAnalytics = ({ taxonomyData }: TabbedAnalyticsProps) => {
  // Key insights data (replace confusing charts with clear takeaways)
  const keyInsights = [
    {
      id: 'most-common',
      title: 'Most Common',
      value: 'Scope 2-Heavy',
      subtitle: '18% of industries',
      insight: 'Primarily manufacturing & energy sectors',
      color: 'blue',
      icon: 'Crown',
      trend: '+2% vs last year'
    },
    {
      id: 'fastest-growing',
      title: 'Fastest Growing',
      value: 'Financial Emissions',
      subtitle: '+22% this year',
      insight: 'New banking regulations driving growth',
      color: 'green',
      icon: 'TrendingUp',
      trend: 'Up from 12% last year'
    },
    {
      id: 'emerging-focus',
      title: 'Emerging Focus',
      value: 'Operational Efficiency',
      subtitle: '16% adoption',
      insight: 'Tech sector leading adoption',
      color: 'purple',
      icon: 'Zap',
      trend: '4 new industries added'
    }
  ];

  // Ranking data (much clearer than bar charts)
  const archetypeRankings = [
    { name: 'Scope 2-Heavy', value: 18, companies: 33, color: '#3b82f6', growth: '+2%' },
    { name: 'Operational Efficiency', value: 16, companies: 29, color: '#8b5cf6', growth: '+5%' },
    { name: 'Financial Emissions', value: 15, companies: 28, color: '#10b981', growth: '+22%' },
    { name: 'Transport Intensive', value: 14, companies: 26, color: '#f59e0b', growth: '+1%' },
    { name: 'Upstream-Heavy', value: 13, companies: 24, color: '#ef4444', growth: '-1%' }
  ];

  const sectorRankings = [
    { name: 'Manufacturing', companies: 35, complianceScore: 87, trend: 'up', growth: '+3' },
    { name: 'IT & Technology', companies: 28, complianceScore: 93, trend: 'up', growth: '+5' },
    { name: 'Energy & Utilities', companies: 22, complianceScore: 78, trend: 'stable', growth: '+1' },
    { name: 'Financial Services', companies: 18, complianceScore: 89, trend: 'up', growth: '+4' },
    { name: 'Transportation', companies: 16, complianceScore: 72, trend: 'down', growth: '-1' },
    { name: 'Healthcare', companies: 14, complianceScore: 85, trend: 'up', growth: '+2' }
  ];

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

  const InsightCard = ({ insight }: { insight: any }) => {
    const iconMap = {
      Crown: Crown,
      TrendingUp: TrendingUp,
      Zap: Zap
    };
    const IconComponent = iconMap[insight.icon as keyof typeof iconMap];

    const colorClasses = {
      blue: 'border-l-blue-500 bg-blue-50',
      green: 'border-l-green-500 bg-green-50',
      purple: 'border-l-purple-500 bg-purple-50'
    };

    return (
      <Card className={`border-l-4 ${colorClasses[insight.color as keyof typeof colorClasses]} hover:shadow-lg transition-all duration-200`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${insight.color === 'blue' ? 'bg-blue-100' : insight.color === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                <IconComponent className={`h-5 w-5 ${insight.color === 'blue' ? 'text-blue-600' : insight.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{insight.title}</h3>
                <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{insight.subtitle}</span>
              <Badge variant="secondary" className="text-xs">
                {insight.trend}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 italic">
              💡 {insight.insight}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const VisualRankingList = ({ data, title, subtitle, valueLabel = "companies" }: { data: any[]; title: string; subtitle?: string; valueLabel?: string }) => {
    const maxValue = Math.max(...data.map(item => item.companies || item.value));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {/* Rank Badge */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.companies || item.value} {valueLabel}
                      </span>
                      {item.growth && (
                        <Badge 
                          variant={item.growth.startsWith('+') ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {item.growth}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${((item.companies || item.value) / maxValue) * 100}%`,
                        backgroundColor: item.color || '#3b82f6'
                      }}
                    />
                  </div>
                  
                  {/* Additional info for sectors */}
                  {item.complianceScore && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Compliance:</span>
                      <span className={`text-xs font-semibold ${
                        item.complianceScore >= 85 ? 'text-green-600' :
                        item.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {item.complianceScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const PerformanceSummaryCards = ({ sectors }: { sectors: any[] }) => {
    const topPerformer = sectors.reduce((prev, current) => 
      (prev.complianceScore > current.complianceScore) ? prev : current
    );
    
    const fastestGrowing = sectors.reduce((prev, current) => 
      (parseInt(prev.growth) > parseInt(current.growth)) ? prev : current
    );
    
    const avgCompliance = Math.round(
      sectors.reduce((sum, sector) => sum + sector.complianceScore, 0) / sectors.length
    );

    return (
      <div className="space-y-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Top Performer</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{topPerformer.name}</div>
            <div className="text-sm text-green-600">{topPerformer.complianceScore}% compliance</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Fastest Growing</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{fastestGrowing.name}</div>
            <div className="text-sm text-blue-600">{fastestGrowing.growth} companies added</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Avg Compliance</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{avgCompliance}%</div>
            <div className="text-sm text-purple-600">Across all sectors</div>
          </CardContent>
        </Card>
      </div>
    );
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
          {/* Insight Cards - Replace first bar chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          
          {/* Visual Rankings - Replace second bar chart */}
          <VisualRankingList 
            data={archetypeRankings}
            title="Archetype Rankings"
            subtitle="Most common emissions archetypes by industry count"
            valueLabel="industries"
          />
        </TabsContent>

        {/* Sectors Analytics Tab */}
        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Rankings - Replace bar charts */}
            <div className="lg:col-span-2">
              <VisualRankingList 
                data={sectorRankings}
                title="Sector Performance Rankings"
                subtitle="Ranked by company count and compliance scores"
                valueLabel="companies"
              />
            </div>
            
            {/* Summary Cards - New addition */}
            <div>
              <PerformanceSummaryCards sectors={sectorRankings} />
            </div>
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