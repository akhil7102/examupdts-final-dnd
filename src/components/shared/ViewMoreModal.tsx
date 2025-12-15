import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface ViewMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function ViewMoreModal({ isOpen, onClose, title, content }: ViewMoreModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-[#0A0A0A] pr-8">{title}</DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-4 top-4"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#0A0A0A]/60" />
            </button>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 px-6 py-6" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div 
            className="prose prose-sm max-w-none text-[#0A0A0A]/80 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}