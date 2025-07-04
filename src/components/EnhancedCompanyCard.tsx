import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Factory, Building, Users, Truck, TrendingUp, Target } from 'lucide-react';
import { EnhancedPlasticCompany } from '@/data/enhancedPlasticPackagingData';

interface EnhancedCompanyCardProps {
  company: EnhancedPlasticCompany;
  categoryKPIs: string[];
}

const EnhancedCompanyCard: React.FC<EnhancedCompanyCardProps> = ({ company, categoryKPIs }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'producer': return Factory;
      case 'converter': return Building;
      case 'brand': return Users;
      case 'waste-management': return Truck;
      default: return Factory;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'producer': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'converter': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'brand': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'waste-management': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Leader': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Above Average': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Below Average': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1000000) {
      return `${(emissions / 1000000).toFixed(1)}M`;
    }
    return `${(emissions / 1000).toFixed(0)}K`;
  };

  const CategoryIcon = getCategoryIcon(company.category);
  
  // Get overall performance tier based on average KPI performance
  const kpiTiers = Object.values(company.kpiScores).map(kpi => kpi.tier);
  const leaderCount = kpiTiers.filter(tier => tier === 'Leader').length;
  const overallTier = leaderCount >= 3 ? 'Leader' : 
                     leaderCount >= 2 ? 'Above Average' : 
                     leaderCount >= 1 ? 'Average' : 'Below Average';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
              <Badge className={`${getTierColor(overallTier)} border text-xs`}>
                {overallTier}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{company.country}</span>
              <span>•</span>
              <span className="truncate">{company.specialization}</span>
            </div>
          </div>
          <Badge className={`${getCategoryColor(company.category)} border flex items-center gap-1`}>
            <CategoryIcon className="h-3 w-3" />
            {company.category.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Emissions Overview */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">Scope 1</span>
            </div>
            <div className="text-muted-foreground">{formatEmissions(company.scope1Emissions)} tCO₂e</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium">Scope 2</span>
            </div>
            <div className="text-muted-foreground">{formatEmissions(company.scope2Emissions)} tCO₂e</div>
          </div>
        </div>

        {/* Revenue & Scale */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="font-medium">Revenue:</span>
            <span className="text-muted-foreground ml-1">${company.revenueBillions}B</span>
          </div>
          {company.annualPolymerUsage && (
            <div>
              <span className="font-medium">Volume:</span>
              <span className="text-muted-foreground ml-1">{(company.annualPolymerUsage / 1000).toFixed(0)}K tonnes</span>
            </div>
          )}
        </div>

        {/* Top KPIs Preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Key Performance Indicators
          </div>
          {categoryKPIs.slice(0, 2).map((kpiName) => {
            const kpiData = company.kpiScores[kpiName];
            if (!kpiData) return null;
            
            return (
              <div key={kpiName} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{kpiName}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kpiData.value.toFixed(1)}</span>
                  <Badge className={`${getTierColor(kpiData.tier)} text-xs px-1 py-0`}>
                    {kpiData.tier.slice(0, 1)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sustainability Targets Preview */}
        {company.sustainabilityTargets.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-1">
              <Target className="h-3 w-3" />
              Key Targets
            </div>
            {company.sustainabilityTargets.slice(0, 2).map((target, index) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground truncate">{target.description}</span>
                  <Badge variant="outline" className="text-xs">
                    {target.year}
                  </Badge>
                </div>
                <Progress 
                  value={target.status === 'achieved' ? 100 : target.status === 'in_progress' ? 60 : 20} 
                  className="h-1 mt-1"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCompanyCard;