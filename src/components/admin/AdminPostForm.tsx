import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, X, Calendar, Link as LinkIcon } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { adminPostsApi, AdminPost } from '../../utils/adminApi';
import { toast } from 'sonner';

const categories = ['Exam Update'];

export function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminPost>>({
    title: '',
    content: '',
    category: 'Exam Update',
    tags: [],
    status: 'draft',
    attachments: [],
    external_link: '',
    timetable_link: '',
    exam_dates: [],
    trending: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [examDatePairs, setExamDatePairs] = useState<{ subject: string; date: string }[]>([
    { subject: '', date: '' },
  ]);

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const post = await adminPostsApi.getById(id);
      if (post) {
        setFormData(post);
        // Load exam dates if they exist
        if (post.exam_dates && post.exam_dates.length > 0) {
          setExamDatePairs(post.exam_dates);
        }
      } else {
        toast.error('Post not found');
        navigate('/admin/notifications');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      toast.error('Failed to load post');
      navigate('/admin/notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      // Filter out empty exam date pairs
      const validExamDates = examDatePairs.filter(pair => pair.subject.trim() && pair.date.trim());
      
      const postData = { 
        ...formData, 
        status,
        exam_dates: validExamDates.length > 0 ? validExamDates : [],
      };

      // If marking as trending, unmark all other trending posts first
      if (postData.trending) {
        try {
          const allPosts = await adminPostsApi.getAll();
          const currentTrendingPosts = allPosts.filter(p => p.trending && p.id !== id);
          
          if (currentTrendingPosts.length > 0) {
            await Promise.all(
              currentTrendingPosts.map(p => adminPostsApi.update(p.id, { trending: false }))
            );
          }
        } catch (error) {
          console.warn('Could not update other trending posts:', error);
          // Continue anyway - the column might not exist yet
        }
      }

      if (isEditMode && id) {
        await adminPostsApi.update(id, postData);
        toast.success(postData.trending 
          ? 'Post updated and marked as trending. Previous trending post has been replaced.' 
          : 'Post updated successfully'
        );
      } else {
        await adminPostsApi.create(postData);
        toast.success(postData.trending 
          ? 'Post created and marked as trending. Previous trending post has been replaced.' 
          : 'Post created successfully'
        );
      }

      navigate('/admin/notifications');
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const addExamDatePair = () => {
    setExamDatePairs([...examDatePairs, { subject: '', date: '' }]);
  };

  const removeExamDatePair = (index: number) => {
    if (examDatePairs.length > 1) {
      setExamDatePairs(examDatePairs.filter((_, i) => i !== index));
    }
  };

  const updateExamDatePair = (index: number, field: 'subject' | 'date', value: string) => {
    const updated = [...examDatePairs];
    updated[index][field] = value;
    setExamDatePairs(updated);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#0A0A0A]/60">Loading post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl text-[#0A0A0A]">
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
          <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
            {formData.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-6">
          {/* Title */}
          <Card className="p-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                Post Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title..."
                className="text-base"
                required
              />
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-[#0A0A0A]/60 mb-2">
                Supports extremely long content (100K+ characters). All formatting will be preserved.
              </p>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter detailed description..."
                className="min-h-[300px] text-base font-mono"
                required
              />
              <p className="text-xs text-[#0A0A0A]/40 mt-1">
                Character count: {formData.content?.length || 0}
              </p>
            </div>
          </Card>

          {/* Category and Tags */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-base">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags..."
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* External Link & Timetable Link */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="external_link" className="text-base flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  External Link (Optional)
                </Label>
                <Input
                  id="external_link"
                  type="url"
                  value={formData.external_link || ''}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                  placeholder="https://example.com"
                />
                <p className="text-xs text-[#0A0A0A]/60">
                  If provided, users will see an "OPEN" button
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timetable_link" className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Time Table Link (Optional)
                </Label>
                <Input
                  id="timetable_link"
                  type="url"
                  value={formData.timetable_link || ''}
                  onChange={(e) => setFormData({ ...formData, timetable_link: e.target.value })}
                  placeholder="https://example.com/timetable.pdf"
                />
                <p className="text-xs text-[#0A0A0A]/60">
                  If provided, users will see "Download Time Table" button
                </p>
              </div>
            </div>

            {/* Trending Checkbox */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trending"
                  checked={formData.trending || false}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="w-4 h-4 text-[#004AAD] rounded border-gray-300 focus:ring-[#004AAD]"
                />
                <Label htmlFor="trending" className="text-base flex items-center gap-2 cursor-pointer">
                  <span className="text-red-500">🔥</span>
                  Mark as Trending
                </Label>
              </div>
              <p className="text-xs text-[#0A0A0A]/60 ml-7 mt-1">
                Trending posts will appear in the "Trending Now" section on the user panel
              </p>
            </div>
          </Card>

          {/* Exam Dates - Dynamic Subject/Date Pairs */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Exam Dates (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExamDatePair}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add More
                </Button>
              </div>
              <p className="text-sm text-[#0A0A0A]/60">
                Add subject-wise exam dates. Each pair will be displayed on the user panel.
              </p>

              <div className="space-y-3">
                {examDatePairs.map((pair, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm">Subject</Label>
                      <Input
                        value={pair.subject}
                        onChange={(e) => updateExamDatePair(index, 'subject', e.target.value)}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Exam Date</Label>
                        {examDatePairs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExamDatePair(index)}
                            className="text-red-500 hover:text-red-700 h-auto p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        type="date"
                        value={pair.date}
                        onChange={(e) => updateExamDatePair(index, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/notifications')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e as any, 'draft')}
              disabled={isSaving}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#004AAD] hover:bg-[#003A8C] flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
