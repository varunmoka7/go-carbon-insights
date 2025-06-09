
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Zap, DollarSign, BarChart3 } from 'lucide-react';

interface EnergyKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  status?: 'good' | 'average' | 'poor';
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  progress?: number;
  target?: number;
  className?: string;
}

const EnergyKPICard = ({ 
  title, 
  value, 
  unit, 
  subtitle, 
  status = 'average', 
  trend, 
  icon,
  progress,
  target,
  className = '' 
}: EnergyKPICardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'good': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'poor': return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <div className="text-teal-600">{icon}</div>}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            {getTrendIcon()}
          </div>
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
        )}

        {progress !== undefined && target !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}% / {target}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (progress / target) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyKPICard;
