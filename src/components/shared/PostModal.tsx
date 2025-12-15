import { X, Clock, TrendingUp, ExternalLink, Download, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Post } from '../../utils/api';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export function PostModal({ isOpen, onClose, post }: PostModalProps) {
  if (!post) return null;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const formatExamDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl text-[#0A0A0A] pr-8">{post.title}</DialogTitle>
            <DialogDescription className="sr-only">
              View full post details including content, exam dates, and download links
            </DialogDescription>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-2 sm:right-4 top-4"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#0A0A0A]/60" />
            </button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Meta */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#004AAD] text-white text-xs">
                {post.category}
              </Badge>
              {post.trending && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60 ml-auto">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {formatTimeAgo(post.date)}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none text-[#0A0A0A]/80 text-sm sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            </div>

            {/* Exam Dates Section */}
            {post.exam_dates && post.exam_dates.length > 0 && (
              <Card className="p-4 sm:p-6 bg-[#F5F5F5] border-none">
                <h3 className="text-base sm:text-lg text-[#0A0A0A] flex items-center gap-2 mb-3 sm:mb-4">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#004AAD]" />
                  Exam Schedule
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                  {post.exam_dates.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm sm:text-base text-[#0A0A0A]">{item.subject}</span>
                      <span className="text-sm sm:text-base text-[#004AAD]">{formatExamDate(item.date)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm text-[#0A0A0A]/60 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons - Sticky at Bottom */}
        {(post.external_link || post.timetable_link) && (
          <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* External Link Button */}
              {post.external_link && (
                <a 
                  href={post.external_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1"
                >
                  <Button className="w-full bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base">
                    <ExternalLink className="w-5 h-5" />
                    <span className="font-medium">OPEN</span>
                  </Button>
                </a>
              )}

              {/* Timetable Download Button */}
              {post.timetable_link && (
                <a 
                  href={post.timetable_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1"
                >
                  <Button 
                    variant="outline"
                    className="w-full border-[#004AAD] text-[#004AAD] hover:bg-[#004AAD] hover:text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download Time Table</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}