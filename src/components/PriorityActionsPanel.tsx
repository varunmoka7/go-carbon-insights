
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PriorityAction {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

interface PriorityActionsPanelProps {
  actions: PriorityAction[];
  className?: string;
}

const PriorityActionsPanel = ({ actions, className = '' }: PriorityActionsPanelProps) => {
  const getImpactConfig = (impact: string) => {
    switch (impact) {
      case 'high':
        return { color: 'text-red-600', bgColor: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle };
      case 'medium':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock };
      case 'low':
        return { color: 'text-green-600', bgColor: 'bg-green-50', border: 'border-green-200', icon: CheckCircle };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', border: 'border-gray-200', icon: Clock };
    }
  };

  const getEffortBadge = (effort: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'default',
      medium: 'secondary', 
      high: 'destructive'
    };
    return variants[effort] || 'outline';
  };

  if (!actions || actions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Priority Actions
          </CardTitle>
          <CardDescription>Actionable insights for climate performance improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-green-700 font-medium">All metrics performing well!</p>
            <p className="text-sm text-gray-600 mt-1">No immediate actions required. Continue monitoring performance.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Priority Actions
        </CardTitle>
        <CardDescription>Actionable insights for climate performance improvement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => {
            const impactConfig = getImpactConfig(action.impact);
            const ImpactIcon = impactConfig.icon;

            return (
              <div
                key={action.id}
                className={`p-4 rounded-lg border ${impactConfig.border} ${impactConfig.bgColor}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImpactIcon className={`h-4 w-4 ${impactConfig.color}`} />
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                    <Badge variant={getEffortBadge(action.effort)} className="text-xs">
                      {action.effort} effort
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{action.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">Impact:</span>
                  <Badge
                    variant={action.impact === 'high' ? 'destructive' : action.impact === 'medium' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {action.impact}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityActionsPanel;
