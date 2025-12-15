import { X, Calendar, Download, FileText, FileSpreadsheet, Video, ExternalLink, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Note } from '../../utils/api';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  if (!note) return null;

  const getFileIcon = (fileType: string) => {
    const type = fileType.toUpperCase();
    if (type === 'PDF') return <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />;
    if (type === 'DOC' || type === 'DOCX') return <FileSpreadsheet className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />;
    if (type === 'PPT' || type === 'PPTX') return <FileSpreadsheet className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />;
    if (type === 'VIDEO' || type === 'MP4') return <Video className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />;
    return <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />;
  };

  const getFileTypeFromUrl = (url: string): string => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('drive.google.com')) {
      if (urlLower.includes('/document/')) return 'google-docs';
      if (urlLower.includes('/presentation/')) return 'google-slides';
      if (urlLower.includes('/spreadsheets/')) return 'google-sheets';
      return 'google-drive';
    }
    if (urlLower.endsWith('.pdf')) return 'pdf';
    if (urlLower.endsWith('.doc') || urlLower.endsWith('.docx')) return 'doc';
    if (urlLower.endsWith('.ppt') || urlLower.endsWith('.pptx')) return 'ppt';
    if (urlLower.endsWith('.mp4') || urlLower.endsWith('.avi') || urlLower.endsWith('.mkv')) return 'video';
    return 'unknown';
  };

  const handleOpenFile = () => {
    if (note.file_url) {
      window.open(note.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  const fileType = getFileTypeFromUrl(note.file_url);
  const isYouTubeOrVideo = fileType === 'youtube' || fileType === 'video';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl text-[#0A0A0A] pr-8">{note.title}</DialogTitle>
            <DialogDescription className="sr-only">
              View note details and access file
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
            {/* File Preview Area */}
            <div className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] rounded-lg h-40 sm:h-48 flex items-center justify-center">
              {getFileIcon(note.file_type)}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[#004AAD] text-white text-xs">
                {note.file_type}
              </Badge>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                {note.downloads.toLocaleString()} downloads
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60 ml-auto">
                {note.fileSize}
              </div>
            </div>

            {/* Note Details */}
            <div className="bg-[#F5F5F5] rounded-lg p-4 sm:p-6 space-y-3">
              <h3 className="text-base sm:text-lg text-[#0A0A0A]">Note Details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Subject</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{note.subject}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Topic</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{note.topic}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">File Type</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{note.file_type}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Upload Date</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{note.uploadDate}</span>
                </div>
              </div>
            </div>

            {/* File Type Info */}
            <div className="flex items-start gap-2 text-sm text-[#0A0A0A]/60 pt-2 border-t border-gray-200">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {isYouTubeOrVideo 
                  ? 'Click the button below to open and watch this video.'
                  : 'Click the button below to open and view this file. You can download it from there.'}
              </span>
            </div>
          </div>
        </ScrollArea>

        {/* Action Button - Sticky at Bottom */}
        <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 sticky bottom-0 z-10">
          <Button 
            onClick={handleOpenFile}
            className="w-full bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="font-medium">
              {isYouTubeOrVideo ? 'OPEN VIDEO' : 'OPEN FILE'}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
