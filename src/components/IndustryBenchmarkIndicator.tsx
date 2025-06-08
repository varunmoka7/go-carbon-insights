
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IndustryBenchmarkIndicatorProps {
  status: 'above' | 'at' | 'below';
  percentage?: number;
  className?: string;
}

const IndustryBenchmarkIndicator = ({ status, percentage, className = '' }: IndustryBenchmarkIndicatorProps) => {
  const getIndicatorConfig = () => {
    switch (status) {
      case 'above':
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          text: 'Above Industry Avg',
          textColor: 'text-green-700'
        };
      case 'below':
        return {
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          text: 'Below Industry Avg',
          textColor: 'text-red-700'
        };
      case 'at':
        return {
          icon: Minus,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          text: 'At Industry Avg',
          textColor: 'text-yellow-700'
        };
    }
  };

  const config = getIndicatorConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor} ${className}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.text}
        {percentage && ` (${percentage > 0 ? '+' : ''}${percentage}%)`}
      </span>
    </div>
  );
};

export default IndustryBenchmarkIndicator;
