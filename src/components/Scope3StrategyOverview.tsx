
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Recycle, Package, Leaf, Users, Zap, Target, BarChart3, Globe } from 'lucide-react';

interface Scope3StrategyOverviewProps {
  companyId: string;
}

const Scope3StrategyOverview = ({ companyId }: Scope3StrategyOverviewProps) => {
  const strategyCategories = [
    {
      category: 'Upstream Scope 3',
      strategies: [
        {
          title: 'Supplier Engagement & Decarbonization',
          icon: <Users className="h-5 w-5" />,
          progress: 78,
          status: 'On Track',
          kpi: '65% suppliers with SBTs'
        },
        {
          title: 'Circular Supply Chain',
          icon: <Recycle className="h-5 w-5" />,
          progress: 45,
          status: 'In Progress',
          kpi: '30% circular materials'
        },
        {
          title: 'Purchased Goods Optimization',
          icon: <Package className="h-5 w-5" />,
          progress: 62,
          status: 'On Track',
          kpi: '15% emissions reduction'
        }
      ]
    },
    {
      category: 'Downstream Scope 3',
      strategies: [
        {
          title: 'Product Lifecycle Management',
          icon: <Leaf className="h-5 w-5" />,
          progress: 55,
          status: 'In Progress',
          kpi: '25% lifecycle impact reduction'
        },
        {
          title: 'End-of-Life Impact Minimization',
          icon: <Target className="h-5 w-5" />,
          progress: 40,
          status: 'Delayed',
          kpi: '85% recyclability rate'
        },
        {
          title: 'Transportation & Logistics',
          icon: <Truck className="h-5 w-5" />,
          progress: 70,
          status: 'On Track',
          kpi: '40% logistics emissions cut'
        }
      ]
    },
    {
      category: 'Advanced Innovation',
      strategies: [
        {
          title: 'Carbon Removal & Offsetting',
          icon: <Globe className="h-5 w-5" />,
          progress: 35,
          status: 'Planning',
          kpi: '10% portfolio in removals'
        },
        {
          title: 'Digital Transformation',
          icon: <Zap className="h-5 w-5" />,
          progress: 80,
          status: 'Leading',
          kpi: '20% efficiency gains'
        },
        {
          title: 'Industry Collaboration',
          icon: <BarChart3 className="h-5 w-5" />,
          progress: 50,
          status: 'In Progress',
          kpi: '5 active partnerships'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Leading': return 'bg-green-100 text-green-800 border-green-200';
      case 'On Track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Planning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Scope 3 Strategy Overview</h2>
      
      {strategyCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {category.strategies.map((strategy, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        {strategy.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{strategy.title}</h4>
                        <p className="text-xs text-gray-600">{strategy.kpi}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(strategy.status)}`}
                    >
                      {strategy.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{strategy.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${strategy.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Scope3StrategyOverview;
