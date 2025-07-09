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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border border-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Industries Tracked</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-secondary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sectors</p>
              <p className="text-3xl font-bold text-secondary">{stats.sectors}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-accent/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Emissions Archetypes</p>
              <p className="text-3xl font-bold text-accent">{stats.archetypes}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Filter className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};