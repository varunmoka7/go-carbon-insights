import React, { useState, useEffect } from 'react';
import { Tag, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TagData {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  category?: string;
}

interface TagCloudProps {
  onTagClick: (tag: string) => void;
  selectedTags: string[];
  showTrending?: boolean;
}

const TagCloud: React.FC<TagCloudProps> = ({ 
  onTagClick, 
  selectedTags, 
  showTrending = true 
}) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [displayMode, setDisplayMode] = useState<'popular' | 'trending' | 'recent'>('popular');

  // Mock tag data - in real implementation, this would come from Supabase
  useEffect(() => {
    const mockTags: TagData[] = [
      { name: 'Scope 3', count: 156, trend: 'up', category: 'emissions' },
      { name: 'Carbon Accounting', count: 142, trend: 'up', category: 'general' },
      { name: 'GHG Protocol', count: 98, trend: 'stable', category: 'standards' },
      { name: 'Supply Chain', count: 87, trend: 'up', category: 'operations' },
      { name: 'PCAF', count: 76, trend: 'down', category: 'finance' },
      { name: 'SBTi', count: 73, trend: 'up', category: 'targets' },
      { name: 'LCA', count: 65, trend: 'stable', category: 'methodology' },
      { name: 'CDP', count: 58, trend: 'up', category: 'reporting' },
      { name: 'ESG', count: 54, trend: 'stable', category: 'general' },
      { name: 'Net Zero', count: 52, trend: 'up', category: 'targets' },
      { name: 'Carbon Footprint', count: 49, trend: 'stable', category: 'measurement' },
      { name: 'TCFD', count: 43, trend: 'up', category: 'reporting' },
      { name: 'Renewable Energy', count: 41, trend: 'up', category: 'energy' },
      { name: 'Scope 1', count: 38, trend: 'stable', category: 'emissions' },
      { name: 'Scope 2', count: 36, trend: 'stable', category: 'emissions' },
      { name: 'Carbon Offsets', count: 34, trend: 'down', category: 'mitigation' },
      { name: 'Sustainability', count: 32, trend: 'stable', category: 'general' },
      { name: 'CSRD', count: 29, trend: 'up', category: 'reporting' },
      { name: 'Decarbonization', count: 27, trend: 'up', category: 'strategy' },
      { name: 'Green Finance', count: 24, trend: 'up', category: 'finance' }
    ];

    // Sort based on display mode
    let sortedTags = [...mockTags];
    switch (displayMode) {
      case 'trending':
        sortedTags = sortedTags
          .filter(tag => tag.trend === 'up')
          .sort((a, b) => b.count - a.count);
        break;
      case 'recent':
        // Mock recent by randomizing order
        sortedTags = sortedTags.sort(() => Math.random() - 0.5);
        break;
      default:
        sortedTags = sortedTags.sort((a, b) => b.count - a.count);
    }

    setTags(sortedTags);
  }, [displayMode]);

  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-lg font-bold';
    if (ratio > 0.6) return 'text-base font-semibold';
    if (ratio > 0.4) return 'text-sm font-medium';
    return 'text-xs font-normal';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      'emissions': 'bg-red-100 text-red-700 border-red-200',
      'standards': 'bg-blue-100 text-blue-700 border-blue-200',
      'operations': 'bg-orange-100 text-orange-700 border-orange-200',
      'finance': 'bg-green-100 text-green-700 border-green-200',
      'targets': 'bg-purple-100 text-purple-700 border-purple-200',
      'methodology': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'reporting': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'energy': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'mitigation': 'bg-teal-100 text-teal-700 border-teal-200',
      'strategy': 'bg-pink-100 text-pink-700 border-pink-200',
      'general': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category || 'general'] || colors.general;
  };

  const maxCount = Math.max(...tags.map(tag => tag.count));

  return (
    <Card className="border border-emerald-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-600" />
            Popular Tags
          </CardTitle>
          
          <div className="flex gap-1">
            <Button
              variant={displayMode === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplayMode('popular')}
              className="text-xs"
            >
              Popular
            </Button>
            <Button
              variant={displayMode === 'trending' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplayMode('trending')}
              className="text-xs"
            >
              Trending
            </Button>
            <Button
              variant={displayMode === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplayMode('recent')}
              className="text-xs"
            >
              Recent
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 20).map((tag) => {
            const isSelected = selectedTags.includes(tag.name);
            const tagSize = getTagSize(tag.count, maxCount);
            
            return (
              <Badge
                key={tag.name}
                variant={isSelected ? "default" : "outline"}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${tagSize}
                  ${isSelected 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : getCategoryColor(tag.category)
                  }
                  flex items-center gap-1 px-3 py-1
                `}
                onClick={() => onTagClick(tag.name)}
              >
                <span>{tag.name}</span>
                <span className="text-xs opacity-75">({tag.count})</span>
                {showTrending && getTrendIcon(tag.trend)}
              </Badge>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {['emissions', 'standards', 'finance', 'reporting', 'targets'].map((category) => (
              <div
                key={category}
                className={`px-2 py-1 rounded-md border ${getCategoryColor(category)}`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {selectedTags.length > 0 
                ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                : 'Click tags to filter discussions'
              }
            </span>
            
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedTags.forEach(tag => onTagClick(tag))}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Trending Insight */}
        {displayMode === 'trending' && (
          <div className="pt-4 border-t border-gray-200 bg-emerald-50 -m-6 mt-4 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Trending Now</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              "Scope 3" and "CSRD" are seeing increased discussion this week
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagCloud;