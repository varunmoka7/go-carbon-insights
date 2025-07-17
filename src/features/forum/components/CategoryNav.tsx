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
  Users,
  Building2,
  Leaf
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
    Building2,
    Leaf,
  };

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-montserrat font-semibold text-emerald-600 text-center">
                Professional Forum
              </h1>
              <p className="text-sm text-gray-600 text-center">
                Carbon Accounting Expertise
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid-based Category Navigation */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-montserrat font-semibold text-emerald-600 text-center mb-2">
            Discussion Categories
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Select a category to explore professional discussions
          </p>
        </div>

         {/* Professional Grid Layout */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {sortedCategories.map((category) => {
            const Icon = iconMap[category.icon] || Building2;
            const isActive = activeCategory === category.slug;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.slug)}
                 className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left items-center
                  hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                  ${isActive 
                    ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}
                aria-label={`Select ${category.name} category`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                   <div className="flex-1 min-w-0">
                    <h3 className={`font-montserrat font-medium text-sm mb-1 text-emerald-600 ${
                      isActive ? 'text-emerald-700' : 'text-emerald-600'
                    }`}>
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Professional CTA */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span className="font-montserrat font-medium text-emerald-700 text-sm">
                Professional Community
              </span>
            </div>
            <p className="text-xs text-emerald-600 leading-relaxed">
              Join carbon accounting experts sharing knowledge on 
              emissions tracking, decarbonization strategies, and ESG reporting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryNav;