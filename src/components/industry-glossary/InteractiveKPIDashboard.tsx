import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers3, BarChart3, Filter } from 'lucide-react';
import { IndustriesTrackedCharts } from './charts/IndustriesTrackedCharts';
import { SectorsCharts } from './charts/SectorsCharts';
import { EmissionsArchetypesCharts } from './charts/EmissionsArchetypesCharts';

interface InteractiveKPIDashboardProps {
  stats: {
    total: number;
    sectors: number;
    archetypes: number;
  };
  taxonomyData: any[];
}

type KPIType = 'industries' | 'sectors' | 'archetypes';

export const InteractiveKPIDashboard = ({ stats, taxonomyData }: InteractiveKPIDashboardProps) => {
  const [selectedKPI, setSelectedKPI] = useState<KPIType>('industries');

  const kpiItems = [
    {
      id: 'industries' as KPIType,
      label: 'Industries Tracked',
      value: stats.total,
      icon: Layers3,
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    {
      id: 'sectors' as KPIType,
      label: 'Sectors',
      value: stats.sectors,
      icon: BarChart3,
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/20'
    },
    {
      id: 'archetypes' as KPIType,
      label: 'Emissions Archetypes',
      value: stats.archetypes,
      icon: Filter,
      color: 'accent',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      borderColor: 'border-accent/20'
    }
  ];

  const renderCharts = () => {
    switch (selectedKPI) {
      case 'industries':
        return <IndustriesTrackedCharts taxonomyData={taxonomyData} />;
      case 'sectors':
        return <SectorsCharts taxonomyData={taxonomyData} />;
      case 'archetypes':
        return <EmissionsArchetypesCharts taxonomyData={taxonomyData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {kpiItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedKPI === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`h-auto p-0 transition-all duration-200 ${
                isSelected ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01]'
              }`}
              onClick={() => setSelectedKPI(item.id)}
            >
               <Card className={`w-full min-h-[280px] border-2 rounded-xl shadow-sm transition-all duration-200 ${
                isSelected 
                  ? `${item.borderColor} ring-2 ring-${item.color}/20 shadow-md` 
                  : `${item.borderColor} hover:shadow-md`
               }`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className={`text-xl font-semibold ${item.textColor}`}>{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to view analytics</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg ${item.bgColor} flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-offset-2 ring-' + item.color + '/30' : ''
                    }`}>
                      <Icon className={`h-6 w-6 ${item.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Button>
          );
        })}
      </div>

      {/* Dynamic Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            {kpiItems.find(k => k.id === selectedKPI)?.label} Analytics
          </h3>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        </div>
        {renderCharts()}
      </div>
    </div>
  );
};