import { Layers3, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPISummaryCardsProps {
  stats: {
    total: number;
    sectors: number;
    archetypes: number;
  };
}

export const KPISummaryCards = ({ stats }: KPISummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Layers3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Industries Tracked</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-secondary">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sectors</p>
              <p className="text-3xl font-bold">{stats.sectors}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-accent">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Emissions Archetypes</p>
              <p className="text-3xl font-bold">{stats.archetypes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};