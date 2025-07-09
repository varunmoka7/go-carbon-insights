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
    <Card className="border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] hover:border-primary/20 min-h-[280px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
            {industry.industry}
          </CardTitle>
          <Badge 
            variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
            className="text-xs shrink-0 font-medium"
          >
            {industry.emissions_archetype}
          </Badge>
        </div>
        <Badge variant="secondary" className="text-sm text-muted-foreground w-fit bg-muted/50">
          {industry.sector}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {industry.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground min-w-0">CDP:</span>
              <span className="text-xs truncate">{industry.cdp_category}</span>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <span className="text-xs font-medium text-muted-foreground min-w-0">GHG Protocol:</span>
                  <span className="text-xs truncate flex-1">{industry.ghg_protocol_alignment}</span>
                  <Info className="h-3 w-3 text-muted-foreground shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{industry.ghg_protocol_alignment}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="pt-3 mt-auto border-t border-border/50">
          <Badge variant="outline" className="text-xs bg-background hover:bg-muted/50">
            {industry.sbti_pathway}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};