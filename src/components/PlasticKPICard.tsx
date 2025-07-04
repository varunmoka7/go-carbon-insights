import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface PlasticKPICardProps {
  kpiName: string;
  value: number;
  unit: string;
  tier: 'Leader' | 'Above Average' | 'Average' | 'Below Average';
  description: string;
  icon: string;
  higherIsBetter: boolean;
  leaderThreshold: number;
  averageThreshold: number;
}

const PlasticKPICard: React.FC<PlasticKPICardProps> = ({
  kpiName,
  value,
  unit,
  tier,
  description,
  icon,
  higherIsBetter,
  leaderThreshold,
  averageThreshold
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Leader': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Above Average': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Below Average': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getProgressValue = () => {
    if (higherIsBetter) {
      return Math.min(100, (value / leaderThreshold) * 100);
    } else {
      return Math.max(0, 100 - ((value / averageThreshold) * 100));
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <CardTitle className="text-sm font-medium">{kpiName}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge className={`${getTierColor(tier)} border text-xs`}>
            {tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <Progress 
          value={getProgressValue()} 
          className="h-2"
        />
        <div className="text-xs text-muted-foreground">
          Target: {higherIsBetter ? '≥' : '≤'} {leaderThreshold}{unit}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlasticKPICard;