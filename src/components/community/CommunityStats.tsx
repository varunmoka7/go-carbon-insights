import React from 'react';
import { Users, UserCheck, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: '1,500',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: UserCheck,
      label: 'Online Now',
      value: '47',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MessageSquare,
      label: 'Expert Answers Today',
      value: '47',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: TrendingUp,
      label: 'Active Discussions',
      value: '23',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <Card className="border border-emerald-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Overview</h3>
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 p-3 bg-emerald-50 rounded-lg">
          <div className="text-sm text-emerald-700 font-medium">
            🌱 Growing community of carbon professionals
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Join the conversation and share your expertise
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityStats;