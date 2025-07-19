import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, MessageSquare, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCommunityCategories } from '../hooks/useCommunityCategories';
import { useCommunityTopics } from '../hooks/useCommunityTopics';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface CategoryListProps {
  onTopicSelect?: (topicId: string) => void;
  onNewTopic?: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onTopicSelect, onNewTopic }) => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCommunityCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (categoriesLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categoriesError) {
    return (
      <Card className="bg-red-900/20 border-red-700">
        <CardContent className="p-4">
          <p className="text-red-400">Error loading categories: {categoriesError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isExpanded={expandedCategories.has(category.id)}
          onToggle={() => toggleCategory(category.id)}
          onTopicSelect={onTopicSelect}
          onNewTopic={onNewTopic}
          canCreateTopic={!!user}
        />
      ))}
    </div>
  );
};

interface CategoryItemProps {
  category: any;
  isExpanded: boolean;
  onToggle: () => void;
  onTopicSelect?: (topicId: string) => void;
  onNewTopic?: (categoryId: string) => void;
  canCreateTopic: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggle,
  onTopicSelect,
  onNewTopic,
  canCreateTopic,
}) => {
  const { topics, loading: topicsLoading, error: topicsError } = useCommunityTopics(
    isExpanded ? category.id : undefined
  );

  const categoryColor = category.color || '#6366f1';

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColor }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-100 truncate">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{topics.length}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="border-t border-gray-700">
          <div className="p-4 space-y-3">
            {canCreateTopic && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewTopic?.(category.id);
                }}
                variant="outline"
                size="sm"
                className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </Button>
            )}
            
            {topicsLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : topicsError ? (
              <p className="text-red-400 text-sm">Error loading topics: {topicsError}</p>
            ) : topics.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No topics yet</p>
            ) : (
              <div className="space-y-2">
                {topics.slice(0, 5).map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    onClick={() => onTopicSelect?.(topic.id)}
                  />
                ))}
                {topics.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-400 hover:text-gray-200"
                    onClick={() => onTopicSelect?.(`category-${category.id}`)}
                  >
                    View all {topics.length} topics
                  </Button>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

interface TopicItemProps {
  topic: any;
  onClick: () => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-200 truncate">
            {topic.is_pinned && (
              <Badge variant="secondary" className="mr-2 bg-blue-600 text-white text-xs">
                Pinned
              </Badge>
            )}
            {topic.title}
          </h4>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{topic.author?.display_name || topic.author?.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{topic.reply_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                {topic.last_reply_at 
                  ? formatDistanceToNow(new Date(topic.last_reply_at), { addSuffix: true })
                  : formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;