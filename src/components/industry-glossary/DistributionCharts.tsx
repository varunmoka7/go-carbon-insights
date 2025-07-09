import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface DistributionChartsProps {
  archetypeChartData: Array<{ name: string; value: number }>;
  sectorChartData: Array<{ name: string; value: number }>;
}

// Enhanced archetype color mapping
const ARCHETYPE_COLORS: Record<string, string> = {
  'Lifecycle-dependent': 'hsl(217, 91%, 60%)', // Blue
  'Scope 2-heavy': 'hsl(25, 95%, 53%)', // Orange
  'Use-phase Dominant': 'hsl(142, 76%, 36%)', // Green
  'Financed Emissions': 'hsl(262, 83%, 58%)', // Purple
  'Operational Emitter': 'hsl(0, 84%, 60%)', // Red
  'Upstream-heavy': 'hsl(45, 93%, 47%)', // Yellow
  'Offset-focused': 'hsl(200, 98%, 39%)', // Cyan
};

const SECTOR_COLORS = [
  'hsl(217, 91%, 60%)', // Blue
  'hsl(142, 76%, 36%)', // Green
  'hsl(25, 95%, 53%)', // Orange
  'hsl(262, 83%, 58%)', // Purple
  'hsl(0, 84%, 60%)', // Red
  'hsl(45, 93%, 47%)', // Yellow
  'hsl(200, 98%, 39%)', // Cyan
  'hsl(300, 76%, 72%)', // Pink
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = data.payload.total || 1;
    const percentage = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg z-50">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-sm text-primary font-medium">
          {data.value} {data.value === 1 ? 'industry' : 'industries'}
        </p>
        <p className="text-xs text-muted-foreground">
          {percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

// Custom label renderer for horizontal bars
const renderCustomizedLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <g>
      <text 
        x={x + width + 8} 
        y={y + height / 2} 
        fill="hsl(var(--foreground))" 
        textAnchor="start" 
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    </g>
  );
};

// Truncate long names for better display
const truncateName = (name: string, maxLength: number = 15) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

export const DistributionCharts = ({ archetypeChartData, sectorChartData }: DistributionChartsProps) => {
  // Loading state
  if (!archetypeChartData.length || !sectorChartData.length) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort archetype data by value for better visualization
  const sortedArchetypeData = [...archetypeChartData]
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      ...item,
      displayName: truncateName(item.name, 18),
      total: archetypeChartData.reduce((sum, d) => sum + d.value, 0)
    }));

  // Sort sector data by value for better visualization
  const sortedSectorData = [...sectorChartData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Show top 8 sectors
    .map(item => ({
      ...item,
      displayName: truncateName(item.name, 12),
      total: sectorChartData.reduce((sum, d) => sum + d.value, 0)
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Emissions Archetype Distribution Chart */}
      <Card className="rounded-xl shadow-sm border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            Emissions Archetype Distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Industry count by emission pattern
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={sortedArchetypeData} 
              layout="horizontal"
              margin={{ top: 10, right: 50, left: 120, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                fontSize={13} 
                tickFormatter={(value) => Math.round(value).toString()}
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 'dataMax']}
              />
              <YAxis 
                type="category" 
                dataKey="displayName" 
                fontSize={12} 
                width={115}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 6, 6, 0]}
                label={renderCustomizedLabel}
              >
                {sortedArchetypeData.map((entry, index) => (
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

      {/* Sector Distribution Chart */}
      <Card className="rounded-xl shadow-sm border border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            Top Sectors by Industry Count
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Top sectors by number of industries classified
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={sortedSectorData}
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
                {sortedSectorData.map((entry, index) => (
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
    </div>
  );
};