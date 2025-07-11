import React, { useState } from 'react';
import { Upload, FileText, MessageSquare, FolderPlus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ContentUploadProps {
  onContentUploaded: () => void;
  categories: any[];
  user: any;
}

type ContentType = 'category' | 'topic' | 'reply';

const ContentUpload: React.FC<ContentUploadProps> = ({ onContentUploaded, categories, user }) => {
  const [contentType, setContentType] = useState<ContentType>('category');
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Form states
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#059669'
  });
  
  const [topicData, setTopicData] = useState({
    title: '',
    content: '',
    category_id: '',
    tags: [] as string[],
    tagInput: ''
  });
  
  const [replyData, setReplyData] = useState({
    content: '',
    topic_id: ''
  });

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('community-content')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('community-content')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleCategoryUpload = async () => {
    try {
      const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('community_categories')
        .insert({
          name: categoryData.name,
          description: categoryData.description,
          slug,
          color: categoryData.color,
          created_by: user.id,
          is_active: true
        });
      
      if (error) throw error;
      
      setCategoryData({ name: '', description: '', slug: '', color: '#059669' });
      onContentUploaded();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleTopicUpload = async () => {
    try {
      let contextFileUrl = null;
      
      if (file) {
        contextFileUrl = await handleFileUpload(file);
      }
      
      const { error } = await supabase
        .from('community_topics')
        .insert({
          title: topicData.title,
          content: topicData.content,
          category_id: topicData.category_id,
          author_id: user.id,
          tags: topicData.tags,
          context_file: contextFileUrl,
          is_pinned: false,
          is_locked: false
        });
      
      if (error) throw error;
      
      setTopicData({ title: '', content: '', category_id: '', tags: [], tagInput: '' });
      setFile(null);
      onContentUploaded();
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const handleReplyUpload = async () => {
    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          content: replyData.content,
          topic_id: replyData.topic_id,
          author_id: user.id,
          is_expert_answer: user.is_gct_team || false
        });
      
      if (error) throw error;
      
      setReplyData({ content: '', topic_id: '' });
      onContentUploaded();
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUploading(true);
    
    try {
      switch (contentType) {
        case 'category':
          await handleCategoryUpload();
          break;
        case 'topic':
          await handleTopicUpload();
          break;
        case 'reply':
          await handleReplyUpload();
          break;
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (topicData.tagInput.trim() && !topicData.tags.includes(topicData.tagInput.trim())) {
      setTopicData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTopicData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!user) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Please sign in to upload content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-emerald-600" />
          Upload Content
        </CardTitle>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant={contentType === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('category')}
            className="flex items-center gap-1"
          >
            <FolderPlus className="h-4 w-4" />
            Category
          </Button>
          <Button
            type="button"
            variant={contentType === 'topic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('topic')}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Topic
          </Button>
          <Button
            type="button"
            variant={contentType === 'reply' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('reply')}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Reply
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {contentType === 'category' && (
            <>
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Scope 3 Emissions"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryData.description}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                />
              </div>
              
              <div>
                <Label htmlFor="categorySlug">Slug (optional)</Label>
                <Input
                  id="categorySlug"
                  value={categoryData.slug}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="Auto-generated from name if empty"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryColor">Color</Label>
                <Input
                  id="categoryColor"
                  type="color"
                  value={categoryData.color}
                  onChange={(e) => setCategoryData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
            </>
          )}

          {contentType === 'topic' && (
            <>
              <div>
                <Label htmlFor="topicCategory">Category</Label>
                <select
                  id="topicCategory"
                  value={topicData.category_id}
                  onChange={(e) => setTopicData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="topicTitle">Title</Label>
                <Input
                  id="topicTitle"
                  value={topicData.title}
                  onChange={(e) => setTopicData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Topic title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="topicContent">Content</Label>
                <Textarea
                  id="topicContent"
                  value={topicData.content}
                  onChange={(e) => setTopicData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Topic content"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="topicTags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="topicTags"
                    value={topicData.tagInput}
                    onChange={(e) => setTopicData(prev => ({ ...prev, tagInput: e.target.value }))}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topicData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="contextFile">Context File (optional)</Label>
                <Input
                  id="contextFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </>
          )}

          {contentType === 'reply' && (
            <>
              <div>
                <Label htmlFor="replyTopic">Topic</Label>
                <Input
                  id="replyTopic"
                  value={replyData.topic_id}
                  onChange={(e) => setReplyData(prev => ({ ...prev, topic_id: e.target.value }))}
                  placeholder="Topic ID to reply to"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="replyContent">Reply Content</Label>
                <Textarea
                  id="replyContent"
                  value={replyData.content}
                  onChange={(e) => setReplyData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Your reply"
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? 'Uploading...' : `Create ${contentType}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentUpload;