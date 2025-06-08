
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import IndustryBenchmarkIndicator from './IndustryBenchmarkIndicator';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  benchmarkStatus?: 'above' | 'at' | 'below';
  className?: string;
  icon?: React.ReactNode;
}

const EnhancedMetricCard = ({ 
  title, 
  value, 
  unit, 
  subtitle, 
  change, 
  trend, 
  benchmarkStatus,
  className = '',
  icon 
}: EnhancedMetricCardProps) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <Card className={`bg-white dark:bg-gray-800 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon && <div className="text-gray-600 dark:text-gray-400">{icon}</div>}
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
          </div>
          {benchmarkStatus && (
            <IndustryBenchmarkIndicator 
              status={benchmarkStatus} 
              className="flex-shrink-0"
            />
          )}
        </div>
        
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{subtitle}</p>
        )}
        
        {change !== undefined && trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {Math.abs(change)}% {trend === 'up' ? 'increase' : 'decrease'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMetricCard;
