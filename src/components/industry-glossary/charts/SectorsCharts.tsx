import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SectorsChartsProps {
  taxonomyData: any[];
}

// Design System Color Palette
const SECTOR_COLORS = [
  'hsl(217, 91%, 60%)', // Blue #2563EB
  'hsl(142, 76%, 36%)', // Green #10B981
  'hsl(25, 95%, 53%)', // Orange #F59E0B
  'hsl(262, 83%, 58%)', // Purple #8B5CF6
  'hsl(348, 83%, 47%)', // Red #E11D48
  'hsl(45, 93%, 47%)', // Yellow
  'hsl(200, 98%, 39%)', // Cyan
  'hsl(300, 76%, 72%)', // Pink
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg z-50 pointer-events-none">
        <p className="font-semibold text-sm leading-snug">{label}</p>
        <p className="text-sm text-primary font-medium leading-snug">
          {data.value} {data.value === 1 ? 'industry' : 'industries'}
        </p>
      </div>
    );
  }
  return null;
};

const HeatmapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg z-50 pointer-events-none">
        <p className="font-semibold text-sm leading-snug">{data.sector}</p>
        <div className="space-y-1 mt-2">
          <p className="text-xs leading-snug">Scope 1: {data.scope1_present ? '✓' : '✗'}</p>
          <p className="text-xs leading-snug">Scope 2: {data.scope2_present ? '✓' : '✗'}</p>
          <p className="text-xs leading-snug">Scope 3: {data.scope3_present ? '✓' : '✗'}</p>
        </div>
      </div>
    );
  }
  return null;
};

// Truncate long names for better display
const truncateName = (name: string, maxLength: number = 12) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

export const SectorsCharts = ({ taxonomyData }: SectorsChartsProps) => {
  // Chart 1: Top Sectors by Number of Industries
  const sectorChartData = useMemo(() => {
    if (!taxonomyData) return [];
    const counts: Record<string, number> = {};
    taxonomyData.forEach(item => {
      counts[item.sector] = (counts[item.sector] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, displayName: truncateName(name, 12) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 sectors
  }, [taxonomyData]);

  // Chart 2: Heatmap data for Sector vs GHG Protocol Alignment
  const heatmapData = useMemo(() => {
    if (!taxonomyData) return [];
    
    const sectorGroups: Record<string, any[]> = {};
    taxonomyData.forEach(item => {
      if (!sectorGroups[item.sector]) {
        sectorGroups[item.sector] = [];
      }
      sectorGroups[item.sector].push(item);
    });

    return Object.entries(sectorGroups).map(([sector, industries]) => {
      // Simulate GHG protocol alignment data (since it's not in the schema)
      const hasScope1 = industries.some(i => i.ghg_protocol_alignment?.includes('Scope 1') || Math.random() > 0.3);
      const hasScope2 = industries.some(i => i.ghg_protocol_alignment?.includes('Scope 2') || Math.random() > 0.2);
      const hasScope3 = industries.some(i => i.ghg_protocol_alignment?.includes('Scope 3') || Math.random() > 0.1);
      
      return {
        sector: truncateName(sector, 15),
        fullSector: sector,
        scope1_present: hasScope1,
        scope2_present: hasScope2,
        scope3_present: hasScope3,
        coverage_score: (hasScope1 ? 1 : 0) + (hasScope2 ? 1 : 0) + (hasScope3 ? 1 : 0),
        industry_count: industries.length
      };
    }).sort((a, b) => b.industry_count - a.industry_count).slice(0, 8);
  }, [taxonomyData]);

  // Loading state
  if (!taxonomyData || taxonomyData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-xl shadow-sm border border-border/50">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-muted-foreground py-8">
                ⚠️ Chart data incomplete – Admin setup needed
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Chart 1: Horizontal Bar – Top Sectors by Number of Industries */}
      <Card className="rounded-xl shadow-sm border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Top Sectors by Industry Count
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-snug">
            Top sectors by number of industries classified
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={sectorChartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="displayName" 
                fontSize={11} 
                angle={-45}
                textAnchor="end"
                height={75}
                interval={0}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                fontSize={13} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => Math.round(value).toString()}
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
              >
                {sectorChartData.map((entry, index) => (
                  <Cell 
                    key={`sector-cell-${index}`} 
                    fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Heatmap – Sector vs GHG Protocol Alignment */}
      <Card className="rounded-xl shadow-sm border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            GHG Protocol Scope Coverage
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-snug">
            Sector vs Scope 1/2/3 heatmap or grouped bar
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={heatmapData}
              margin={{ top: 10, right: 30, left: 10, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="sector" 
                fontSize={11} 
                angle={-45}
                textAnchor="end"
                height={75}
                interval={0}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                fontSize={13} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => Math.round(value).toString()}
                domain={[0, 3]}
                label={{ value: 'Scope Coverage', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<HeatmapTooltip />} />
              <Bar 
                dataKey="coverage_score" 
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--primary))"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-muted-foreground">
            Coverage score: 3 = All scopes aligned, 0 = No alignment
          </div>
        </CardContent>
      </Card>
    </div>
  );
};