
import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricTooltipProps {
  metric: string;
  className?: string;
}

const metricDefinitions: Record<string, string> = {
  'Carbon Intensity': 'Emissions per unit of revenue (tCO2e per $M). Lower values indicate more efficient operations.',
  'Scope 3 Coverage': 'Percentage of supply chain emissions being tracked and measured.',
  'Avoided Emissions': 'CO2 reductions achieved through implemented projects and initiatives.',
  'SBTi Status': 'Science-Based Targets initiative approval status for climate commitments.',
  'Energy Efficiency': 'Improvement in energy consumption per unit of output since baseline year.',
  'Supplier Engagement': 'Percentage of high-impact suppliers participating in emission reduction programs.',
  'Renewable Energy': 'Percentage of electricity consumption from renewable sources.',
  'Fleet Electrification': 'Percentage of company vehicle fleet using electric power.',
  'Total Emissions': 'Total greenhouse gas emissions across all scopes (Scope 1, 2, and 3).',
  'Net Zero Progress': 'Progress toward achieving net zero emissions by target date.',
  'Climate Risk Score': 'Assessment of physical and transition climate risks to business operations.',
  'Carbon Cost Exposure': 'Potential financial impact of carbon pricing on operations.',
  'Climate Investment': 'Annual budget allocated to climate action and decarbonization projects.',
  'Average Project ROI': 'Return on investment for climate and sustainability projects.',
  'Green Revenue': 'Revenue generated from sustainable products and services.'
};

const MetricTooltip = ({ metric, className = '' }: MetricTooltipProps) => {
  const definition = metricDefinitions[metric];
  
  if (!definition) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 text-sm">
          <p>{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MetricTooltip;
