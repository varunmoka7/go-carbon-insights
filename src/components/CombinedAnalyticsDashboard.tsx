import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target,
  Eye,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useViewModeContext } from '@/contexts/ViewModeContext';

interface AnalyticsData {
  totalEmissions: number;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  yearOverYearChange: number;
  industryBenchmark: number;
  targetProgress: number;
  dataQuality: number;
  lastUpdated: string;
}

interface CombinedAnalyticsDashboardProps {
  className?: string;
}

export const CombinedAnalyticsDashboard: React.FC<CombinedAnalyticsDashboardProps> = ({
  className = ''
}) => {
  const { viewMode } = useViewModeContext();

  // Mock data - replace with actual API calls
  const mockData: AnalyticsData = {
    totalEmissions: 125000,
    scope1Emissions: 25000,
    scope2Emissions: 35000,
    scope3Emissions: 65000,
    yearOverYearChange: -8.5,
    industryBenchmark: 140000,
    targetProgress: 75,
    dataQuality: 92,
    lastUpdated: '2024-01-15'
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'combined':
        return <Eye className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getViewModeColor = () => {
    switch (viewMode) {
      case 'public':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'private':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'combined':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatEmissions = (value: number) => {
    return `${(value / 1000).toFixed(1)}k tCO2e`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getQualityStatus = (quality: number) => {
    if (quality >= 90) {
      return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Excellent', color: 'text-green-600' };
    } else if (quality >= 75) {
      return { icon: <CheckCircle className="h-4 w-4 text-yellow-600" />, text: 'Good', color: 'text-yellow-600' };
    } else {
      return { icon: <AlertTriangle className="h-4 w-4 text-red-600" />, text: 'Needs Attention', color: 'text-red-600' };
    }
  };

  const qualityStatus = getQualityStatus(mockData.dataQuality);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive emissions analysis and insights
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`flex items-center gap-2 px-3 py-1 ${getViewModeColor()}`}
        >
          {getViewModeIcon()}
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Emissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEmissions(mockData.totalEmissions)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {getChangeIcon(mockData.yearOverYearChange)}
              <span className={mockData.yearOverYearChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(mockData.yearOverYearChange)}% vs last year
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Scope Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scope 1</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEmissions(mockData.scope1Emissions)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((mockData.scope1Emissions / mockData.totalEmissions) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmark */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Benchmark</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEmissions(mockData.industryBenchmark)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Industry average
            </div>
          </CardContent>
        </Card>

        {/* Target Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.targetProgress}%</div>
            <Progress value={mockData.targetProgress} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              Towards 2030 goal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scope Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
            <CardDescription>
              Breakdown of emissions across different scopes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Scope 1</span>
                </div>
                <span className="text-sm font-medium">{formatEmissions(mockData.scope1Emissions)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Scope 2</span>
                </div>
                <span className="text-sm font-medium">{formatEmissions(mockData.scope2Emissions)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Scope 3</span>
                </div>
                <span className="text-sm font-medium">{formatEmissions(mockData.scope3Emissions)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality & Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Data Quality & Insights</CardTitle>
            <CardDescription>
              Assessment of data reliability and key insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Quality Score</span>
                <div className="flex items-center gap-2">
                  {qualityStatus.icon}
                  <span className={`text-sm font-medium ${qualityStatus.color}`}>
                    {qualityStatus.text} ({mockData.dataQuality}%)
                  </span>
                </div>
              </div>
              <Progress value={mockData.dataQuality} className="w-full" />
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Scope 3 emissions represent the largest portion (52%)</li>
                  <li>• 8.5% reduction year-over-year exceeds industry average</li>
                  <li>• On track to meet 2030 reduction targets</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(mockData.lastUpdated).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            Share Insights
          </Button>
          <Button size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};