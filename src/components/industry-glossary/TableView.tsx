import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Industry } from './IndustryCard';

interface TableViewProps {
  industries: Industry[];
  getArchetypeBadgeVariant: (archetype: string) => "default" | "secondary" | "destructive" | "outline";
}

export const TableView = ({ industries, getArchetypeBadgeVariant }: TableViewProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Industry</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Archetype</TableHead>
            <TableHead>CDP Category</TableHead>
            <TableHead>SBTi Pathway</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {industries.map((industry) => (
            <TableRow key={industry.id}>
              <TableCell className="font-medium">{industry.industry}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {industry.sector}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getArchetypeBadgeVariant(industry.emissions_archetype)} 
                  className="text-xs"
                >
                  {industry.emissions_archetype}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{industry.cdp_category}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {industry.sbti_pathway}
                </Badge>
              </TableCell>
              <TableCell className="text-sm max-w-md truncate">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">{industry.description}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-sm">{industry.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};