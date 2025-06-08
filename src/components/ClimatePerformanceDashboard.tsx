
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Factory
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

const ClimatePerformanceDashboard = ({ climateMetrics, carbonProjects, priorityActions, companyName }: Props) => {
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

  return (
    <div className="space-y-8">
      {/* Executive Climate Scorecard */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
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

      {/* Priority Actions Panel */}
      <PriorityActionsPanel actions={priorityActions} />

      {/* Strategic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Row 1: Emissions Intelligence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Total Emissions
              <MetricTooltip metric="Total Emissions" />
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.totalEmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tCO2e annually</p>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">25% below industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Carbon Intensity
              <MetricTooltip metric="Carbon Intensity" />
              <MetricAlertIcon alert={climateMetrics.alerts.carbonIntensity} metricName="Carbon Intensity" />
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.carbonIntensity}</div>
            <p className="text-xs text-muted-foreground">tCO2e per $M revenue</p>
            <div className="mt-2">
              <Progress 
                value={Math.max(0, Math.min(100, 100 - (climateMetrics.carbonIntensity / climateMetrics.industryBenchmark.carbonIntensity.value) * 50))} 
                className="mb-2"
                style={{ '--progress-foreground': getProgressBarColor(climateMetrics.alerts.carbonIntensity) } as React.CSSProperties}
              />
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.carbonIntensity.status}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Scope 3 Coverage
              <MetricTooltip metric="Scope 3 Coverage" />
              <MetricAlertIcon alert={climateMetrics.alerts.scope3Coverage} metricName="Scope 3 Coverage" />
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.scope3Coverage}%</div>
            <p className="text-xs text-muted-foreground">Supply chain mapped</p>
            <div className="mt-2">
              <Progress 
                value={climateMetrics.scope3Coverage} 
                className="mb-2"
                style={{ '--progress-foreground': getProgressBarColor(climateMetrics.alerts.scope3Coverage) } as React.CSSProperties}
              />
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.scope3Coverage.status}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Avoided Emissions
              <MetricTooltip metric="Avoided Emissions" />
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.avoidedEmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tCO2e from projects</p>
            <Progress value={90} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">Exceeding targets</p>
          </CardContent>
        </Card>

        {/* Row 2: Carbon Levers Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Renewable Energy
              <MetricTooltip metric="Renewable Energy" />
              <MetricAlertIcon alert={climateMetrics.alerts.renewableEnergy} metricName="Renewable Energy" />
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.renewableEnergy}%</div>
            <p className="text-xs text-muted-foreground">Clean electricity</p>
            <div className="mt-2">
              <Progress 
                value={climateMetrics.renewableEnergy} 
                className="mb-2"
                style={{ '--progress-foreground': getProgressBarColor(climateMetrics.alerts.renewableEnergy) } as React.CSSProperties}
              />
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.renewableEnergy.status}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Energy Efficiency
              <MetricTooltip metric="Energy Efficiency" />
              <MetricAlertIcon alert={climateMetrics.alerts.energyEfficiency} metricName="Energy Efficiency" />
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.energyEfficiency}%</div>
            <p className="text-xs text-muted-foreground">Improvement since 2020</p>
            <div className="mt-2">
              <Progress 
                value={Math.min(100, (climateMetrics.energyEfficiency / 50) * 100)} 
                className="mb-2"
                style={{ '--progress-foreground': getProgressBarColor(climateMetrics.alerts.energyEfficiency) } as React.CSSProperties}
              />
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.energyEfficiency.status}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Fleet Electrification
              <MetricTooltip metric="Fleet Electrification" />
            </CardTitle>
            <Factory className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Electric vehicles</p>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-purple-600 mt-1">On track for 2028</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Supplier Engagement
              <MetricTooltip metric="Supplier Engagement" />
              <MetricAlertIcon alert={climateMetrics.alerts.supplierEngagement} metricName="Supplier Engagement" />
            </CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.supplierEngagement}%</div>
            <p className="text-xs text-muted-foreground">With targets set</p>
            <div className="mt-2">
              <Progress 
                value={climateMetrics.supplierEngagement} 
                className="mb-2"
                style={{ '--progress-foreground': getProgressBarColor(climateMetrics.alerts.supplierEngagement) } as React.CSSProperties}
              />
              <IndustryBenchmarkIndicator 
                status={climateMetrics.industryBenchmark.supplierEngagement.status}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Row 3: Financial Climate Impact */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Carbon Cost Exposure
              <MetricTooltip metric="Carbon Cost Exposure" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(climateMetrics.carbonCostExposure / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">At $85/tCO2e</p>
            <Progress value={30} className="mt-2" />
            <p className="text-xs text-red-600 mt-1">Risk decreasing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Climate Investment
              <MetricTooltip metric="Climate Investment" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(climateMetrics.climateInvestment / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Annual budget</p>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-blue-600 mt-1">2% of revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Average Project ROI
              <MetricTooltip metric="Average Project ROI" />
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateMetrics.averageROI}%</div>
            <p className="text-xs text-muted-foreground">Internal rate of return</p>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">Strong business case</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Green Revenue
              <MetricTooltip metric="Green Revenue" />
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(climateMetrics.greenRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Sustainable products</p>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">15% of total revenue</p>
          </CardContent>
        </Card>
      </div>

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
                <Tooltip formatter={(value, name) => [value ? `${value} tCO2e` : 'Target', name === 'actual' ? 'Actual' : 'Target']} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} name="Target Pathway" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Emissions" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Carbon Projects Portfolio */}
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

      {/* Carbon Projects Details */}
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
    </div>
  );
};

export default ClimatePerformanceDashboard;
