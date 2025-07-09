import { Info } from 'lucide-react';
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

export const IndustryCard = ({ industry, getArchetypeBadgeVariant }: IndustryCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {industry.industry}
          </CardTitle>
          <Badge 
            variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
            className="text-xs shrink-0"
          >
            {industry.emissions_archetype}
          </Badge>
        </div>
        <Badge variant="secondary" className="text-xs w-fit">
          {industry.sector}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {industry.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">CDP:</span>
            <span className="text-xs">{industry.cdp_category}</span>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <span className="text-xs font-medium text-muted-foreground">GHG Protocol:</span>
                <span className="text-xs truncate">{industry.ghg_protocol_alignment}</span>
                <Info className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{industry.ghg_protocol_alignment}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            {industry.sbti_pathway}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};