import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Industry } from './IndustryCard';

interface GroupedViewProps {
  groupedData: Record<string, Industry[]>;
  getArchetypeBadgeVariant: (archetype: string) => "default" | "secondary" | "destructive" | "outline";
}

export const GroupedView = ({ groupedData, getArchetypeBadgeVariant }: GroupedViewProps) => {
  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {Object.entries(groupedData).map(([sector, industries]) => (
        <AccordionItem key={sector} value={sector} className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">{sector}</span>
              <Badge variant="secondary">{industries.length} industries</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <Card key={industry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-start justify-between gap-2">
                      {industry.industry}
                      <Badge 
                        variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
                        className="text-xs shrink-0"
                      >
                        {industry.emissions_archetype}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {industry.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {industry.sbti_pathway}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};