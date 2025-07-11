import React from 'react';
import sectorEmissions from '@/data/sources/sector-emissions-sources.json';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const acronymMap: Record<string, string> = {
  'Fossil fuel electricity': 'FFE',
  'Heat generation': 'HG',
  'Other energy': 'OE',
  'Steel production': 'SP',
  'Cement production': 'CP',
  'Chemicals': 'CH',
  'Other manufacturing': 'OM',
  'Livestock': 'LS',
  'Crop production': 'CRP',
  'Land use change': 'LUC',
  'Forestry': 'FR',
  'Road transport': 'RT',
  'Aviation': 'AV',
  'Shipping': 'SH',
  'Rail transport': 'RTS',
  'Iron ore mining': 'IOM',
  'Coal mining': 'CM',
  'Upstream operations': 'UO',
  'Refining': 'RF',
  'Data centers': 'DC',
  'Food processing': 'FP',
  'Distribution': 'DS',
  'Medical equipment': 'ME',
  'Lighting & appliances': 'LA',
  'Energy losses': 'EL',
  'Cooling systems': 'CS',
  'Residential heating': 'RH',
  'Commercial buildings': 'CB',
  'Fugitive emissions': 'FE',
  'Buildings': 'BLD',
  'Other energy uses': 'OEU',
};
const getAcronym = (name: string) => acronymMap[name] || name.split(' ').map(w => w[0]).join('').toUpperCase();

// Add color scale logic
const getColor = (value: number) => {
  if (value > 5) return '#d73027'; // Very high (red)
  if (value > 2) return '#f46d43'; // High (orange)
  if (value > 1) return '#fee08b'; // Medium (yellow)
  if (value > 0.5) return '#abdda4'; // Low (light green)
  return '#66bd63'; // Very low (green)
};

const treemapData = Array.isArray(sectorEmissions.sectors)
  ? sectorEmissions.sectors.map((sector: any) => ({
      name: getAcronym(sector.sector),
      fullName: sector.sector,
      value: parseFloat(sector.absolute),
      color: getColor(parseFloat(sector.absolute)),
      children: sector.subcategories
        ? sector.subcategories.map((sub: any) => ({
            name: getAcronym(sub.name),
            fullName: sub.name,
            value: parseFloat(sub.value),
            color: getColor(parseFloat(sub.value)),
          }))
        : [],
    }))
  : [];

function TreemapContent(props: any) {
  // Debug: log props if blank page
  if (!props || typeof props.x !== 'number' || typeof props.y !== 'number' || typeof props.width !== 'number' || typeof props.height !== 'number') {
    console.log('TreemapContent props:', props);
    return null;
  }
  const { x, y, width, height, name, fullName, value, color } = props;
  const minWidth = 80;
  const minHeight = 40;
  const showText = width > minWidth && height > minHeight;
  const fitsFullName = showText && (fullName && fullName.length * 8 < width - 16);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill: color || '#8884d8', stroke: '#fff', opacity: 0.9 }}
        rx={8}
      />
      {showText && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 4}
            textAnchor="middle"
            fill="#000"
            fontWeight="bold"
            fontSize={16}
            style={{ pointerEvents: 'none', fontFamily: 'Inter, Arial, sans-serif' }}
          >
            {fitsFullName ? fullName : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 16}
            textAnchor="middle"
            fill="#000"
            fontWeight="normal"
            fontSize={14}
            style={{ pointerEvents: 'none', fontFamily: 'Inter, Arial, sans-serif' }}
          >
            {value} Gt
          </text>
        </>
      )}
    </g>
  );
}
// Wrap TreemapContent with React.forwardRef for recharts compatibility
const ForwardedTreemapContent = React.forwardRef<SVGGElement, any>((props, ref) => <TreemapContent {...props} ref={ref} />);

const TreemapTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: 8, padding: 12, minWidth: 180, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{data.fullName || data.name}</div>
        <div style={{ fontSize: 14 }}>Emissions: <b>{data.value} GtCO₂eq</b></div>
      </div>
    );
  }
  return null;
};

const EmissionTracking: React.FC = () => {
  const navigate = useNavigate();
  if (!Array.isArray(sectorEmissions.sectors) || sectorEmissions.sectors.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div style={{ color: 'red', fontWeight: 600, fontSize: 20, textAlign: 'center' }}>
          No sector emissions data found. Please check your data source.
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <section className="container mx-auto py-8">
        <div className="mb-4 flex justify-start">
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">GLOBAL SECTORS EMISSIONS DISTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            <div style={{ width: '100%', minHeight: '90vh', height: '90vh' }}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="value"
                  stroke="#fff"
                  fill="#8884d8"
                  aspectRatio={16 / 9}
                  content={<TreemapContent />}
                >
                  <Tooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default EmissionTracking; 