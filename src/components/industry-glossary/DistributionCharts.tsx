import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

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
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} industries ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const DistributionCharts = ({ archetypeChartData, sectorChartData }: DistributionChartsProps) => {
  // Sort archetype data by value for better visualization
  const sortedArchetypeData = [...archetypeChartData]
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      ...item,
      total: archetypeChartData.reduce((sum, d) => sum + d.value, 0)
    }));

  // Sort sector data by value for better visualization
  const sortedSectorData = [...sectorChartData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Show top 8 sectors
    .map(item => ({
      ...item,
      total: sectorChartData.reduce((sum, d) => sum + d.value, 0)
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Emissions Archetype Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Industry count by emission pattern</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              data={sortedArchetypeData} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <XAxis type="number" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                fontSize={11} 
                width={75}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
              >
                {sortedArchetypeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ARCHETYPE_COLORS[entry.name] || 'hsl(var(--primary))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Top Sectors by Industry Count</CardTitle>
          <p className="text-sm text-muted-foreground">Most represented sectors</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              data={sortedSectorData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <XAxis 
                dataKey="name" 
                fontSize={10} 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {sortedSectorData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
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