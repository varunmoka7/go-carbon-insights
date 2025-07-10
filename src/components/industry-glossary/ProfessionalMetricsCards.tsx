import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Globe, Target } from 'lucide-react';

interface ProfessionalMetricsCardsProps {
  stats: {
    total: number;
    sectors: number;
    archetypes: number;
  };
}

export const ProfessionalMetricsCards = ({ stats }: ProfessionalMetricsCardsProps) => {
  const metrics = [
    {
      title: 'Industries Tracked',
      value: stats.total,
      badge: '+12 this month',
      icon: Globe,
      color: 'border-l-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Sectors',
      value: stats.sectors,
      badge: 'Complete coverage',
      icon: TrendingUp,
      color: 'border-l-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Emissions Archetypes',
      value: stats.archetypes,
      badge: 'Framework aligned',
      icon: Target,
      color: 'border-l-purple-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <Card 
            key={index} 
            className={`border-l-4 ${metric.color} hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {metric.value}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {metric.badge}
                  </span>
                </div>
                <div className={`p-3 ${metric.bgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};