import { useState } from 'react';
import { useEmissionsArchetypes } from '@/hooks/useEmissionsArchetypes';
import { useIndustryTaxonomy } from '@/hooks/useIndustryTaxonomy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export const EmissionsArchetypeFilter = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');
  
  const { data: archetypes, isLoading: archetypesLoading } = useEmissionsArchetypes();
  const { data: industries, isLoading: industriesLoading } = useIndustryTaxonomy(
    selectedArchetype || undefined
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emissions Archetype Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md">
            <Select
              value={selectedArchetype}
              onValueChange={setSelectedArchetype}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an emissions archetype..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Archetypes</SelectItem>
                {archetypesLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  archetypes?.map((archetype) => (
                    <SelectItem key={archetype.id} value={archetype.name || ''}>
                      {archetype.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Industry Taxonomy Results
            {selectedArchetype && (
              <Badge variant="secondary" className="ml-2">
                {selectedArchetype}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {industriesLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading industries...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sector</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Emissions Archetype</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden lg:table-cell">GHG Protocol</TableHead>
                    <TableHead className="hidden lg:table-cell">CDP Category</TableHead>
                    <TableHead className="hidden xl:table-cell">SBTi Pathway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industries?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No industries found for the selected archetype.
                      </TableCell>
                    </TableRow>
                  ) : (
                    industries?.map((industry) => (
                      <TableRow key={industry.id}>
                        <TableCell className="font-medium">{industry.sector}</TableCell>
                        <TableCell>{industry.industry}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{industry.emissions_archetype}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {industry.description || '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {industry.ghg_protocol_alignment || '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {industry.cdp_category || '-'}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {industry.sbti_pathway || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};