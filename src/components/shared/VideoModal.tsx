import { X, Calendar, Eye, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { YouTubeVideo } from '../../utils/api';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: YouTubeVideo | null;
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  if (!video) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getYouTubeVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return url;
  };

  const getEmbedUrl = (videoUrl: string, customEmbed?: string): string => {
    if (customEmbed) return customEmbed;
    const videoId = getYouTubeVideoId(videoUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleOpenYouTube = () => {
    window.open(video.video_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl text-[#0A0A0A] pr-8">{video.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Watch video and get details
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
            {/* Video Player */}
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(video.video_link, video.embed_link)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#004AAD] text-white text-xs">
                {video.category}
              </Badge>
              {video.views && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {video.views.toLocaleString()} views
                </div>
              )}
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60 ml-auto">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {formatDate(video.uploadedDate)}
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div>
                <h3 className="text-base sm:text-lg text-[#0A0A0A] mb-3">About this video</h3>
                <div className="prose prose-sm max-w-none text-[#0A0A0A]/80 text-sm sm:text-base">
                  <p className="whitespace-pre-wrap">{video.description}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Button - Sticky at Bottom */}
        <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 sticky bottom-0 z-10">
          <Button 
            onClick={handleOpenYouTube}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="font-medium">WATCH ON YOUTUBE</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
