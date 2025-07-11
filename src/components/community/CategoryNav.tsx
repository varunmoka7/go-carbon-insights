import React from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Truck, 
  FileText, 
  Target, 
  Zap, 
  BarChart3, 
  Scale, 
  Database, 
  Users 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategorySelect: (categorySlug: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  const iconMap: Record<string, React.ElementType> = {
    TrendingUp,
    Calculator,
    Truck,
    FileText,
    Target,
    Zap,
    BarChart3,
    Scale,
    Database,
    Users,
  };

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Card className="border border-emerald-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          Discussion Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {sortedCategories.map((category) => {
            const Icon = iconMap[category.icon] || Users;
            const isActive = activeCategory === category.slug;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.slug)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-emerald-50 ${
                  isActive 
                    ? 'bg-emerald-100 border border-emerald-300' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color 
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-emerald-900' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {category.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 text-center">
            <span className="font-medium">💡 New to carbon tracking?</span>
            <br />
            Start with Community Support for guidance
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryNav;