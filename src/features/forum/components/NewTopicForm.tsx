import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCommunityCategories } from '../hooks/useCommunityCategories';
import { useCommunityTopics } from '../hooks/useCommunityTopics';
import { useAuth } from '@/contexts/AuthContext';

interface NewTopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId?: string;
}

const NewTopicForm: React.FC<NewTopicFormProps> = ({
  isOpen,
  onClose,
  initialCategoryId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategoryId || '');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCommunityCategories();
  const { createTopic } = useCommunityTopics();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialCategoryId) {
      setCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a topic');
      return;
    }

    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTopic = await createTopic({
        title: title.trim(),
        content: content.trim(),
        category_id: categoryId,
        tags: tags.length > 0 ? tags : undefined,
      });

      setTitle('');
      setContent('');
      setCategoryId(initialCategoryId || '');
      setTags([]);
      setCurrentTag('');
      
      onClose();
      navigate(`/community/topics/${newTopic.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setCategoryId(initialCategoryId || '');
    setTags([]);
    setCurrentTag('');
    setError(null);
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Login Required</h3>
            <p className="text-gray-400 mb-4">You must be logged in to create a new topic.</p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-100">
            Create New Topic
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-900/20 border-red-700">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-200">
                Category *
              </label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={categoriesLoading}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-gray-100">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || '#6366f1' }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-200">
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter topic title..."
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                maxLength={200}
                required
              />
              <div className="text-xs text-gray-400 text-right">
                {title.length}/200
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-200">
                Content *
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter topic content..."
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                maxLength={5000}
                required
              />
              <div className="text-xs text-gray-400 text-right">
                {content.length}/5000
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium text-gray-200">
                Tags (optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-blue-600 text-white"
                  >
                    {tag}
                    <Button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-white hover:text-gray-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  maxLength={20}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  disabled={!currentTag.trim() || tags.length >= 5}
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-400">
                {tags.length}/5 tags
              </div>
            </div>
          </CardContent>

          <div className="flex justify-between p-6 pt-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create Topic
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewTopicForm;
