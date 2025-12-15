import { X, Calendar, ExternalLink, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Result } from '../../utils/api';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Result | null;
}

export function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  if (!result) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl text-[#0A0A0A] pr-8">{result.title}</DialogTitle>
            <DialogDescription className="sr-only">
              View full result details including description and download links
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
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                {result.status}
              </Badge>
              <Badge className="bg-[#004AAD] text-white text-xs">
                {result.exam}
              </Badge>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#0A0A0A]/60 ml-auto">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {formatDate(result.date)}
              </div>
            </div>

            {/* Description */}
            {result.description && (
              <div>
                <h3 className="text-base sm:text-lg text-[#0A0A0A] mb-3">Description</h3>
                <div className="prose prose-sm max-w-none text-[#0A0A0A]/80 text-sm sm:text-base">
                  <p className="whitespace-pre-wrap">{result.description}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons - Sticky at Bottom */}
        {(result.server1_link || result.server2_link || result.pdfLink) && (
          <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 sticky bottom-0 z-10">
            <div className="flex flex-col gap-3">
              {/* Server 1 Link */}
              {result.server1_link && (
                <Button 
                  onClick={() => handleOpenLink(result.server1_link!)}
                  className="w-full bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-medium">OPEN SERVER 1</span>
                </Button>
              )}

              {/* Server 2 Link */}
              {result.server2_link && (
                <Button 
                  onClick={() => handleOpenLink(result.server2_link!)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-medium">OPEN SERVER 2</span>
                </Button>
              )}

              {/* Fallback to legacy link if no server links */}
              {!result.server1_link && !result.server2_link && result.pdfLink && (
                <Button 
                  onClick={() => handleOpenLink(result.pdfLink)}
                  className="w-full bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center justify-center gap-2 h-12 sm:h-11 text-base"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">DOWNLOAD PDF</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}