import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { categoryPerformanceData } from '@/data/enhancedPlasticPackagingData';

interface CategoryKPIOverviewProps {
  category: 'producers' | 'converters' | 'brands' | 'wasteManagement';
  selectedCategory: string;
}

const CategoryKPIOverview: React.FC<CategoryKPIOverviewProps> = ({ category, selectedCategory }) => {
  const data = categoryPerformanceData[category];
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'producers': return '🏭 Producers';
      case 'converters': return '📦 Converters';
      case 'brands': return '🛒 Brands';
      case 'wasteManagement': return '♻️ Waste Management';
      default: return category;
    }
  };

  const getCategoryKPIs = () => {
    switch (category) {
      case 'producers': {
        const producerData = data as typeof categoryPerformanceData.producers;
        return [
          { name: 'Avg Carbon Intensity', value: producerData.avgCarbonIntensity, unit: 'tCO₂e/ton', target: 1.8 },
          { name: 'Avg Bio-based Ratio', value: producerData.avgBioBasedRatio, unit: '%', target: 25 },
          { name: 'Avg Renewable Energy', value: producerData.avgRenewableEnergy, unit: '%', target: 70 },
          { name: 'Avg Recyclable Portfolio', value: producerData.avgRecyclablePortfolio, unit: '%', target: 80 }
        ];
      }
      case 'converters': {
        const converterData = data as typeof categoryPerformanceData.converters;
        return [
          { name: 'Avg Material Efficiency', value: converterData.avgMaterialEfficiency, unit: '%', target: 85 },
          { name: 'Avg Lightweighting', value: converterData.avgLightweighting, unit: '%', target: 20 },
          { name: 'Avg Recyclability Index', value: converterData.avgRecyclabilityIndex, unit: 'score', target: 85 },
          { name: 'Avg Eco-design Share', value: converterData.avgEcoDesignShare, unit: '%', target: 60 }
        ];
      }
      case 'brands': {
        const brandData = data as typeof categoryPerformanceData.brands;
        return [
          { name: 'Avg Circular Content', value: brandData.avgCircularContent, unit: '%', target: 50 },
          { name: 'Avg Packaging Intensity', value: brandData.avgPackagingIntensity, unit: 'g/€', target: 15 },
          { name: 'Avg Reuse Rate', value: brandData.avgReuseRate, unit: '%', target: 30 },
          { name: 'Avg EPR Score', value: brandData.avgEPRScore, unit: 'score', target: 90 }
        ];
      }
      case 'wasteManagement': {
        const wasteData = data as typeof categoryPerformanceData.wasteManagement;
        return [
          { name: 'Avg Recovery Efficiency', value: wasteData.avgRecoveryEfficiency, unit: '%', target: 85 },
          { name: 'Avg Output Quality', value: wasteData.avgOutputQuality, unit: '%', target: 70 },
          { name: 'Avg Tech Innovation', value: wasteData.avgTechInnovation, unit: 'score', target: 80 },
          { name: 'Avg Collection Reach', value: wasteData.avgCollectionReach, unit: '%', target: 90 }
        ];
      }
      default:
        return [];
    }
  };

  const kpis = getCategoryKPIs();
  const leadershipRate = (data.leaderCount / data.totalCompanies) * 100;

  if (selectedCategory !== 'all' && selectedCategory !== category.replace('Management', '-management')) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{getCategoryTitle()} Performance Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {data.leaderCount} Leaders
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {data.totalCompanies} Companies
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, index) => {
            const isIntensityMetric = kpi.name.includes('Intensity');
            const progress = isIntensityMetric 
              ? Math.max(0, 100 - ((kpi.value / kpi.target) * 100))
              : Math.min(100, (kpi.value / kpi.target) * 100);
              
            return (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {kpi.name}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{kpi.value.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Target: {isIntensityMetric ? '≤' : '≥'} {kpi.target}{kpi.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Leadership Rate:</span>
            <span className="text-sm font-bold text-green-600">{leadershipRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {data.leaderCount} of {data.totalCompanies} companies achieving leader status
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryKPIOverview;