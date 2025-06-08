
import React from 'react';
import { AlertCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricAlertIconProps {
  alert: 'critical' | 'warning' | 'trending' | 'good';
  metricName: string;
  className?: string;
}

const MetricAlertIcon = ({ alert, metricName, className = '' }: MetricAlertIconProps) => {
  const getAlertConfig = () => {
    switch (alert) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          message: `🔴 Critical: ${metricName} is significantly below target`,
          bgColor: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          message: `🟡 Warning: ${metricName} needs attention`,
          bgColor: 'bg-yellow-50'
        };
      case 'trending':
        return {
          icon: TrendingDown,
          color: 'text-orange-600',
          message: `📈 Trending: Negative trend detected in ${metricName}`,
          bgColor: 'bg-orange-50'
        };
      case 'good':
        return null;
    }
  };

  const config = getAlertConfig();
  
  if (!config) return null;
  
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${config.bgColor} ${className}`}>
            <Icon className={`h-3 w-3 ${config.color}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-2 text-sm">
          <p>{config.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MetricAlertIcon;
