/**
 * Improved Climate Performance Dashboard
 * Incorporates UI/UX best practices and realistic data modeling
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Target, 
  TrendingUp, 
  Leaf, 
  Zap, 
  DollarSign, 
  Activity,
  Shield,
  Award,
  Building2,
  Factory,
  ChevronDown,
  ChevronUp,
  Eye,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import MetricTooltip from './MetricTooltip';
import IndustryBenchmarkIndicator from './IndustryBenchmarkIndicator';
import PriorityActionsPanel from './PriorityActionsPanel';
import MetricAlertIcon from './MetricAlertIcon';

// Types (same as original)
interface ClimateMetrics {
  temperatureAlignment: string;
  netZeroProgress: number;
  sbtiStatus: string;
  climateRiskScore: string;
  totalEmissions: number;
  carbonIntensity: number;
  renewableEnergy: number;
  avoidedEmissions: number;
  carbonCostExposure: number;
  climateInvestment: number;
  averageROI: number;
  greenRevenue: number;
  scope3Coverage: number;
  energyEfficiency: number;
  supplierEngagement: number;
  industryBenchmark: {
    carbonIntensity: { value: number; status: 'above' | 'at' | 'below' };
    renewableEnergy: { value: number; status: 'above' | 'at' | 'below' };
    scope3Coverage: { value: number; status: 'above' | 'at' | 'below' };
    energyEfficiency: { value: number; status: 'above' | 'at' | 'below' };
    supplierEngagement: { value: number; status: 'above' | 'at' | 'below' };
  };
  alerts: {
    carbonIntensity: 'critical' | 'warning' | 'trending' | 'good';
    scope3Coverage: 'critical' | 'warning' | 'trending' | 'good';
    renewableEnergy: 'critical' | 'warning' | 'trending' | 'good';
    energyEfficiency: 'critical' | 'warning' | 'trending' | 'good';
    supplierEngagement: 'critical' | 'warning' | 'trending' | 'good';
  };
}

interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  investment: number;
  annualReduction: number;
  paybackPeriod: number;
  roi: number;
  description: string;
}

interface PriorityAction {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

interface Props {
  climateMetrics: ClimateMetrics;
  carbonProjects: CarbonProject[];
  priorityActions: PriorityAction[];
  companyName: string;
}

type ViewMode = 'executive' | 'operational' | 'detailed';

const ImprovedClimatePerformanceDashboard = ({ climateMetrics, carbonProjects, priorityActions, companyName }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('executive');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    emissions: false,
    levers: false,
    financial: false,
    projects: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const pathwayData = [
    { year: 2020, actual: climateMetrics.totalEmissions * 1.2, target: climateMetrics.totalEmissions * 1.2 },
    { year: 2021, actual: climateMetrics.totalEmissions * 1.1, target: climateMetrics.totalEmissions * 1.15 },
    { year: 2022, actual: climateMetrics.totalEmissions * 1.05, target: climateMetrics.totalEmissions * 1.1 },
    { year: 2023, actual: climateMetrics.totalEmissions, target: climateMetrics.totalEmissions * 1.05 },
    { year: 2024, actual: null, target: climateMetrics.totalEmissions * 0.95 },
    { year: 2025, actual: null, target: climateMetrics.totalEmissions * 0.85 },
    { year: 2030, actual: null, target: climateMetrics.totalEmissions * 0.5 },
    { year: 2050, actual: null, target: 0 }
  ];

  const projectTypeData = [
    { type: 'Renewable Energy', value: 40, color: '#10b981' },
    { type: 'Energy Efficiency', value: 30, color: '#3b82f6' },
    { type: 'Electrification', value: 20, color: '#8b5cf6' },
    { type: 'Carbon Removal', value: 10, color: '#f59e0b' }
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'committed': return 'secondary';
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getProgressBarColor = (alert: string) => {
    switch (alert) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'trending': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  // Executive Summary - Always Visible
  const ExecutiveSummary = () => (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Climate Scorecard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{climateMetrics.temperatureAlignment}</div>
          <div className="text-sm text-gray-600">Temperature Pathway</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{climateMetrics.netZeroProgress.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Net Zero Progress</div>
        </div>
        <div className="text-center">
          <Badge variant={getBadgeVariant(climateMetrics.sbtiStatus)} className="mb-2">
            {climateMetrics.sbtiStatus.toUpperCase()}
          </Badge>
          <div className="text-sm text-gray-600">SBTi Status</div>
        </div>
        <div className="text-center">
          <Badge variant={getBadgeVariant(climateMetrics.climateRiskScore)} className="mb-2">
            {climateMetrics.climateRiskScore.toUpperCase()} RISK
          </Badge>
          <div className="text-sm text-gray-600">Climate Risk</div>
        </div>
      </div>
    </div>
  );

  // View Mode Switcher
  const ViewModeSwitcher = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      <Button
        variant={viewMode === 'executive' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('executive')}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Executive
      </Button>
      <Button
        variant={viewMode === 'operational' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('operational')}
        className="flex items-center gap-2"
      >
        <Activity className="h-4 w-4" />
        Operational
      </Button>
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('detailed')}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Detailed
      </Button>
    </div>
  );

  // Grouped Metrics Cards
  const EmissionsPerformanceGroup = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            Emissions Performance
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('emissions')}
          >
            {expandedSections.emissions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">{climateMetrics.totalEmissions.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-2">Total Emissions (tCO2e)</div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">{climateMetrics.carbonIntensity}</div>
            <div className="text-sm text-gray-600 mb-2">Carbon Intensity (tCO2e/$M)</div>
            <div className="flex items-center justify-center gap-2">
              <MetricAlertIcon alert={climateMetrics.alerts.carbonIntensity} metricName="Carbon Intensity" />
              <IndustryBenchmarkIndicator status={climateMetrics.industryBenchmark.carbonIntensity.status} />
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{climateMetrics.scope3Coverage}%</div>
            <div className="text-sm text-gray-600 mb-2">Scope 3 Coverage</div>
            <div className="flex items-center justify-center gap-2">
              <MetricAlertIcon alert={climateMetrics.alerts.scope3Coverage} metricName="Scope 3 Coverage" />
              <IndustryBenchmarkIndicator status={climateMetrics.industryBenchmark.scope3Coverage.status} />
            </div>
          </div>
        </div>
        <Collapsible open={expandedSections.emissions}>
          <CollapsibleContent className="mt-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Avoided Emissions: {climateMetrics.avoidedEmissions.toLocaleString()} tCO2e from projects</p>
              <p>• Industry Benchmark: {climateMetrics.industryBenchmark.carbonIntensity.value} tCO2e/$M average</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );

  const DecarbonizationLeversGroup = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Decarbonization Levers
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('levers')}
          >
            {expandedSections.levers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{climateMetrics.renewableEnergy}%</div>
            <div className="text-sm text-gray-600 mb-2">Renewable Energy</div>
            <div className="flex items-center justify-center gap-2">
              <MetricAlertIcon alert={climateMetrics.alerts.renewableEnergy} metricName="Renewable Energy" />
              <IndustryBenchmarkIndicator status={climateMetrics.industryBenchmark.renewableEnergy.status} />
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{climateMetrics.energyEfficiency}%</div>
            <div className="text-sm text-gray-600 mb-2">Energy Efficiency Improvement</div>
            <div className="flex items-center justify-center gap-2">
              <MetricAlertIcon alert={climateMetrics.alerts.energyEfficiency} metricName="Energy Efficiency" />
              <IndustryBenchmarkIndicator status={climateMetrics.industryBenchmark.energyEfficiency.status} />
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">{climateMetrics.supplierEngagement}%</div>
            <div className="text-sm text-gray-600 mb-2">Supplier Engagement</div>
            <div className="flex items-center justify-center gap-2">
              <MetricAlertIcon alert={climateMetrics.alerts.supplierEngagement} metricName="Supplier Engagement" />
              <IndustryBenchmarkIndicator status={climateMetrics.industryBenchmark.supplierEngagement.status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FinancialImpactGroup = () => (
    <Collapsible open={expandedSections.financial}>
      <Card className="mb-6">
        <CardHeader>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Financial Climate Impact
              </CardTitle>
              <Button variant="ghost" size="sm">
                {expandedSections.financial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">${(climateMetrics.climateInvestment / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600 mb-2">Annual Climate Investment</div>
                <div className="text-xs text-blue-600">2% of revenue</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">${(climateMetrics.greenRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600 mb-2">Green Revenue</div>
                <div className="text-xs text-green-600">Sustainable products</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">${(climateMetrics.carbonCostExposure / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600 mb-2">Carbon Cost Exposure</div>
                <div className="text-xs text-red-600">Risk decreasing</div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="space-y-6">
      {/* Executive Summary - Always Visible */}
      <ExecutiveSummary />

      {/* Priority Actions - Always Visible */}
      <PriorityActionsPanel actions={priorityActions} />

      {/* View Mode Switcher */}
      <ViewModeSwitcher />

      {/* Conditional Content Based on View Mode */}
      {viewMode === 'executive' && (
        <div className="space-y-6">
          <EmissionsPerformanceGroup />
          <DecarbonizationLeversGroup />
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => toggleSection('financial')}
              className="mb-4"
            >
              {expandedSections.financial ? 'Hide' : 'Show'} Financial Details
            </Button>
          </div>
          <FinancialImpactGroup />
        </div>
      )}

      {viewMode === 'operational' && (
        <div className="space-y-6">
          <EmissionsPerformanceGroup />
          <DecarbonizationLeversGroup />
          <FinancialImpactGroup />
          
          {/* Operational Analytics */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Decarbonization Pathway</CardTitle>
                <CardDescription>Progress toward net zero targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pathwayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value ? `${value} tCO2e` : 'Target', name === 'actual' ? 'Actual' : 'Target']} />
                    <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} name="Target Pathway" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Emissions" connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Portfolio</CardTitle>
                <CardDescription>Investment by project type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.type}: ${entry.value}%`}
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'detailed' && (
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">All Metrics</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-6">
            <EmissionsPerformanceGroup />
            <DecarbonizationLeversGroup />
            <FinancialImpactGroup />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Decarbonization Projects</CardTitle>
                <CardDescription>Strategic initiatives driving emission reductions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={project.status === 'completed' ? 'default' : project.status === 'active' ? 'secondary' : 'outline'}>
                            {project.status}
                          </Badge>
                          <span className="text-sm text-gray-500">ROI: {project.roi}%</span>
                          <span className="text-sm text-gray-500">Payback: {project.paybackPeriod} years</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">${(project.investment / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-green-600">{project.annualReduction.toLocaleString()} tCO2e/year</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Science-Based Decarbonization Pathway</CardTitle>
                  <CardDescription>Progress toward net zero aligned with 1.5°C scenario</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={pathwayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value ? `${value} tCO2e` : 'Target', name === 'actual' ? 'Actual' : 'Target']} />
                      <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} name="Target Pathway" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Emissions" connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carbon Projects Portfolio</CardTitle>
                  <CardDescription>Investment allocation by project type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => `${entry.type}: ${entry.value}%`}
                      >
                        {projectTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ImprovedClimatePerformanceDashboard;