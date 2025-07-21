import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';
import type { Topic, TopicUpdate } from '../types';

const topicEditSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters'),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(10000, 'Content must not exceed 10,000 characters'),
  category_id: z.string().optional()
});

type TopicEditFormData = z.infer<typeof topicEditSchema>;

interface EditTopicFormProps {
  topic: Topic;
  onSave: (updates: TopicUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const EditTopicForm: React.FC<EditTopicFormProps> = ({
  topic,
  onSave,
  onCancel,
  isLoading = false,
  error = null
}) => {
  const form = useForm<TopicEditFormData>({
    resolver: zodResolver(topicEditSchema),
    defaultValues: {
      title: topic.title,
      content: topic.content,
      category_id: topic.category_id || ''
    }
  });

  const onSubmit = async (data: TopicEditFormData) => {
    try {
      const updates: TopicUpdate = {
        title: data.title,
        content: data.content
      };
      
      if (data.category_id) {
        updates.category_id = data.category_id;
      }
      
      await onSave(updates);
    } catch (error) {
      console.error('Error submitting edit form:', error);
    }
  };

  const titleLength = form.watch('title')?.length || 0;
  const contentLength = form.watch('content')?.length || 0;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Topic</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter topic title..."
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="flex justify-between text-sm text-gray-500">
                  <FormMessage />
                  <span>{titleLength}/200</span>
                </div>
              </FormItem>
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your topic content..."
                    className="min-h-[200px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="flex justify-between text-sm text-gray-500">
                  <FormMessage />
                  <span>{contentLength}/10,000</span>
                </div>
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No category</SelectItem>
                    {/* TODO: Load categories dynamically */}
                    <SelectItem value="general">General Discussion</SelectItem>
                    <SelectItem value="scope3">Scope 3 Emissions</SelectItem>
                    <SelectItem value="reporting">Reporting & Compliance</SelectItem>
                    <SelectItem value="technology">Technology & Tools</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};