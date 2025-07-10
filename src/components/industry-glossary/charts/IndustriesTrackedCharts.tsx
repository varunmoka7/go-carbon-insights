import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface IndustriesTrackedChartsProps {
  taxonomyData: any[];
}

// Design System Color Palette for Emissions Archetypes
const ARCHETYPE_COLORS: Record<string, string> = {
  'Lifecycle-dependent': 'hsl(217, 91%, 60%)', // Blue #2563EB
  'Scope 2-heavy': 'hsl(25, 95%, 53%)', // Orange #F59E0B
  'Use-phase Dominant': 'hsl(142, 76%, 36%)', // Green #10B981
  'Financed Emissions': 'hsl(262, 83%, 58%)', // Purple #8B5CF6
  'Operational Emitter': 'hsl(348, 83%, 47%)', // Red #E11D48
  'Upstream-heavy': 'hsl(45, 93%, 47%)', // Yellow
  'Offset-focused': 'hsl(200, 98%, 39%)', // Cyan
};

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


// Truncate long names for better display
const truncateName = (name: string, maxLength: number = 15) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

export const IndustriesTrackedCharts = ({ taxonomyData }: IndustriesTrackedChartsProps) => {
  // Chart 1: Industry Count by Emissions Archetype
  const archetypeChartData = useMemo(() => {
    if (!taxonomyData) return [];
    const counts: Record<string, number> = {};
    taxonomyData.forEach(item => {
      counts[item.emissions_archetype] = (counts[item.emissions_archetype] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, displayName: truncateName(name, 18) }))
      .sort((a, b) => b.value - a.value);
  }, [taxonomyData]);

  // Chart 2: Sector distribution data
  const sectorData = useMemo(() => {
    if (!taxonomyData) return [];
    
    const sectorGroups: Record<string, number> = {};
    taxonomyData.forEach(item => {
      sectorGroups[item.sector] = (sectorGroups[item.sector] || 0) + 1;
    });

    return Object.entries(sectorGroups)
      .map(([name, value]) => ({ name, value, displayName: truncateName(name, 12) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 sectors
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
      {/* Chart 1: Horizontal Bar – Industry Count by Emissions Archetype */}
      <Card className="rounded-xl shadow-sm border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Industry Count by Emissions Archetype
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-snug">
            Industry count by emission pattern
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={archetypeChartData} 
              layout="horizontal"
              margin={{ top: 10, right: 50, left: 120, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                fontSize={12} 
                tickFormatter={(value) => Math.round(value).toString()}
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 'dataMax']}
                allowDecimals={false}
              />
              <YAxis 
                type="category" 
                dataKey="displayName" 
                fontSize={11} 
                width={115}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 10, textAnchor: 'end' }}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 6, 6, 0]}
              >
                {archetypeChartData.map((entry, index) => (
                  <Cell 
                    key={`archetype-cell-${index}`} 
                    fill={ARCHETYPE_COLORS[entry.name] || 'hsl(var(--primary))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Sector Distribution Bar Chart */}
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
              data={sectorData}
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
                {sectorData.map((entry, index) => (
                  <Cell 
                    key={`sector-cell-${index}`} 
                    fill={ARCHETYPE_COLORS[Object.keys(ARCHETYPE_COLORS)[index % Object.keys(ARCHETYPE_COLORS).length]] || 'hsl(var(--primary))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};