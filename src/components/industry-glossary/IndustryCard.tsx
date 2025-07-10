import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface Industry {
  id: string;
  industry: string;
  sector: string;
  emissions_archetype: string;
  description: string;
  ghg_protocol_alignment: string;
  cdp_category: string;
  sbti_pathway: string;
}

interface IndustryCardProps {
  industry: Industry;
  getArchetypeBadgeVariant: (archetype: string) => "default" | "secondary" | "destructive" | "outline";
}

// Create brief, layman-friendly descriptions
const getBriefDescription = (industry: Industry): string => {
  const industryName = industry.industry.toLowerCase();
  
  // Create simple descriptions based on industry name
  if (industryName.includes('education')) return 'Educational institutions and training services';
  if (industryName.includes('farm') || industryName.includes('crop')) return 'Agricultural production and farming operations';
  if (industryName.includes('food')) return 'Food processing and distribution networks';
  if (industryName.includes('footwear')) return 'Footwear manufacturing and accessories production';
  if (industryName.includes('transport') || industryName.includes('logistics')) return 'Transportation and logistics services';
  if (industryName.includes('construction') || industryName.includes('building')) return 'Construction and building services';
  if (industryName.includes('energy') || industryName.includes('power')) return 'Energy production and power generation';
  if (industryName.includes('manufacturing') || industryName.includes('production')) return 'Manufacturing and production operations';
  if (industryName.includes('retail') || industryName.includes('commerce')) return 'Retail and commercial operations';
  if (industryName.includes('financial') || industryName.includes('banking')) return 'Financial services and banking';
  if (industryName.includes('technology') || industryName.includes('software')) return 'Technology and software services';
  if (industryName.includes('healthcare') || industryName.includes('medical')) return 'Healthcare and medical services';
  if (industryName.includes('mining') || industryName.includes('extraction')) return 'Mining and resource extraction';
  if (industryName.includes('chemical') || industryName.includes('pharmaceutical')) return 'Chemical and pharmaceutical production';
  if (industryName.includes('textiles') || industryName.includes('apparel')) return 'Textiles and apparel manufacturing';
  if (industryName.includes('automotive') || industryName.includes('vehicle')) return 'Automotive and vehicle manufacturing';
  if (industryName.includes('aerospace') || industryName.includes('aviation')) return 'Aerospace and aviation industry';
  if (industryName.includes('telecommunications') || industryName.includes('telecom')) return 'Telecommunications and communication services';
  if (industryName.includes('real estate') || industryName.includes('property')) return 'Real estate and property services';
  if (industryName.includes('hospitality') || industryName.includes('tourism')) return 'Hospitality and tourism services';
  
  // Fallback to truncated original description
  return industry.description.length > 80 
    ? industry.description.substring(0, 80) + '...'
    : industry.description;
};

// Archetype color mapping
const getArchetypeColorClass = (archetype: string): string => {
  const colors: Record<string, string> = {
    'Financed Emissions': 'bg-blue-100 text-blue-800 border-blue-200',
    'Lifecycle-dependent': 'bg-green-100 text-green-800 border-green-200',
    'Offset-focused': 'bg-purple-100 text-purple-800 border-purple-200',
    'Operational Emitter': 'bg-orange-100 text-orange-800 border-orange-200',
    'Scope 2-heavy': 'bg-red-100 text-red-800 border-red-200',
    'Upstream-heavy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Use-phase Dominant': 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };
  
  return colors[archetype] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const IndustryCard = ({ industry, getArchetypeBadgeVariant }: IndustryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const briefDescription = getBriefDescription(industry);
  const archetypeColorClass = getArchetypeColorClass(industry.emissions_archetype);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-gray-300 bg-white"
      onClick={toggleExpanded}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Always Visible Content */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {industry.industry}
            </h3>
            <Badge 
              className={`text-xs font-medium rounded-full px-3 py-1 border ${archetypeColorClass} shrink-0`}
            >
              {industry.emissions_archetype}
            </Badge>
          </div>
          
          <p className="text-sm font-medium text-gray-500">
            {industry.sector}
          </p>
          
          <p className="text-gray-600 leading-relaxed">
            {isExpanded ? industry.description : briefDescription}
          </p>
          
          {/* Expandable Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-700 min-w-0">CDP Category:</span>
                  <span className="text-gray-600">{industry.cdp_category}</span>
                </div>
                
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-start gap-2 cursor-help">
                        <span className="font-medium text-gray-700 min-w-0">GHG Protocol:</span>
                        <div className="flex-1">
                          <span className="text-gray-600">{industry.ghg_protocol_alignment}</span>
                          <Info className="h-3 w-3 text-gray-400 inline ml-1" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Greenhouse Gas Protocol alignment details for this industry</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-700 min-w-0">SBTi Pathway:</span>
                  <span className="text-gray-600">{industry.sbti_pathway}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Click Indicator */}
          <div className="flex items-center justify-center pt-2">
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Click to collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Click to expand
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};