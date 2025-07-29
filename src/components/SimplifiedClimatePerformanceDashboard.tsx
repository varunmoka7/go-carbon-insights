import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import MetricTooltip from './MetricTooltip';
import IndustryBenchmarkIndicator from './IndustryBenchmarkIndicator';
import PriorityActionsPanel from './PriorityActionsPanel';
import MetricAlertIcon from './MetricAlertIcon';

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

const SimplifiedClimatePerformanceDashboard = ({ 
  climateMetrics, 
  carbonProjects, 
  priorityActions, 
  companyName 
}: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('executive');
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const formatEmissions = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Executive View - Only the most critical metrics
  const ExecutiveView = () => (
    <div className="space-y-6">
      {/* Executive Climate Scorecard */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Climate Scorecard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{climateMetrics.temperatureAlignment}</div>
            <div className="text-sm text-gray-600">Temperature Pathway</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{climateMetrics.netZeroProgress}%</div>
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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEmissions(climateMetrics.totalEmissions)}</div>
            <p className="text-xs text-muted-foreground">tCO2e annually</p>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">25% below industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Climate Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(climateMetrics.climateInvestment)}</div>
            <p className="text-xs text-muted-foreground">Annual budget</p>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-blue-600 mt-1">2% of revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.renewableEnergy}%</div>
            <p className="text-xs text-muted-foreground">Clean electricity</p>
            <Progress value={climateMetrics.renewableEnergy} className="mt-2" />
            <IndustryBenchmarkIndicator 
              status={climateMetrics.industryBenchmark.renewableEnergy.status}
              className="text-xs mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Green Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(climateMetrics.greenRevenue)}</div>
            <p className="text-xs text-muted-foreground">Sustainable products</p>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">20% of total revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Operational View - Grouped metrics for department managers
  const OperationalView = () => (
    <div className="space-y-8">
      <ExecutiveView />
      
      {/* Operational Metrics - Grouped */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Emissions Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Emissions Management
            </CardTitle>
            <CardDescription>Core emission reduction metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">{climateMetrics.carbonIntensity}</div>
                <p className="text-xs text-muted-foreground">tCO2e per $M revenue</p>
                <IndustryBenchmarkIndicator 
                  status={climateMetrics.industryBenchmark.carbonIntensity.status}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{climateMetrics.scope3Coverage}%</div>
                <p className="text-xs text-muted-foreground">Supply chain mapped</p>
                <IndustryBenchmarkIndicator 
                  status={climateMetrics.industryBenchmark.scope3Coverage.status}
                  className="text-xs mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy & Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Energy & Efficiency
            </CardTitle>
            <CardDescription>Energy transformation metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">{climateMetrics.energyEfficiency}%</div>
                <p className="text-xs text-muted-foreground">Improvement since 2020</p>
                <IndustryBenchmarkIndicator 
                  status={climateMetrics.industryBenchmark.energyEfficiency.status}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{formatEmissions(climateMetrics.avoidedEmissions)}</div>
                <p className="text-xs text-muted-foreground">tCO2e avoided</p>
                <p className="text-xs text-green-600 mt-1">Exceeding targets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Supply Chain Performance
          </CardTitle>
          <CardDescription>Supplier engagement and decarbonization progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{climateMetrics.supplierEngagement}%</div>
              <p className="text-sm text-muted-foreground">Suppliers with targets</p>
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.supplierEngagement.status}
                className="text-xs mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{climateMetrics.scope3Coverage}%</div>
              <p className="text-sm text-muted-foreground">Supply chain mapped</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{climateMetrics.averageROI}%</div>
              <p className="text-sm text-muted-foreground">Project ROI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Detailed View - Full analytics for specialists
  const DetailedView = () => (
    <div className="space-y-8">
      <OperationalView />
      
      {/* Advanced Analytics Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Climate Pathway Visualization */}
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
                <Tooltip formatter={(value, name) => [value ? `${formatEmissions(Number(value))} tCO2e` : 'Target', name === 'actual' ? 'Actual' : 'Target']} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} name="Target Pathway" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Emissions" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Climate Impact</CardTitle>
            <CardDescription>Investment and risk exposure overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{formatCurrency(climateMetrics.carbonCostExposure)}</div>
                <p className="text-xs text-red-600">Carbon Cost Exposure</p>
                <p className="text-xs text-muted-foreground">At $85/tCO2e</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{climateMetrics.averageROI}%</div>
                <p className="text-xs text-green-600">Average Project ROI</p>
                <p className="text-xs text-muted-foreground">Internal rate of return</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Projects Details */}
      <Card>
        <CardHeader>
          <CardTitle>Active Decarbonization Projects</CardTitle>
          <CardDescription>Strategic initiatives driving emission reductions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {carbonProjects.slice(0, showAdvanced ? carbonProjects.length : 3).map((project) => (
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
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(project.investment)}</div>
                  <div className="text-sm text-green-600">{formatEmissions(project.annualReduction)} tCO2e/year</div>
                </div>
              </div>
            ))}
            {carbonProjects.length > 3 && (
              <Button 
                variant="outline" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full"
              >
                {showAdvanced ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show All Projects ({carbonProjects.length - 3} more)
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Climate Performance Dashboard</h1>
          <p className="text-sm text-gray-600">Strategic climate intelligence for {companyName}</p>
        </div>
        <div className="flex items-center space-x-2">
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
            <BarChart3 className="h-4 w-4" />
            Detailed
          </Button>
        </div>
      </div>

      {/* Priority Actions - Always visible */}
      <PriorityActionsPanel actions={priorityActions} />

      {/* Render appropriate view */}
      {viewMode === 'executive' && <ExecutiveView />}
      {viewMode === 'operational' && <OperationalView />}
      {viewMode === 'detailed' && <DetailedView />}
    </div>
  );
};

export default SimplifiedClimatePerformanceDashboard;