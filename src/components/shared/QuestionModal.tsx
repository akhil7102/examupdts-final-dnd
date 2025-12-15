import { X, BookOpen, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Question } from '../../utils/api';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
}

export function QuestionModal({ isOpen, onClose, question }: QuestionModalProps) {
  if (!question) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-600';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'Hard':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#004AAD] to-[#0066DD] sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 pr-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl text-white mb-2">{question.title}</DialogTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                    {question.subject}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                    {question.topic}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`border-0 text-xs ${
                      question.difficulty === 'Easy' 
                        ? 'bg-green-500/20 text-white' 
                        : question.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-white'
                        : 'bg-red-500/20 text-white'
                    }`}
                  >
                    {question.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <DialogDescription className="sr-only">
              View question details and content
            </DialogDescription>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors absolute right-2 sm:right-4 top-4"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Question Content */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-[#004AAD] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg text-[#0A0A0A] mb-3">Question</h3>
                  <div className="prose prose-sm max-w-none text-[#0A0A0A]/80 text-sm sm:text-base">
                    <p className="whitespace-pre-wrap">{question.content}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Image */}
            {question.image_url && (
              <div>
                <h3 className="text-base sm:text-lg text-[#0A0A0A] mb-3">Reference Image</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={question.image_url}
                    alt={question.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="bg-[#F5F5F5] rounded-lg p-4 sm:p-6 space-y-3">
              <h3 className="text-base sm:text-lg text-[#0A0A0A]">Additional Details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Subject</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{question.subject}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Topic</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{question.topic}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Difficulty Level</span>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#0A0A0A]/60">Views</span>
                  <span className="text-sm sm:text-base text-[#0A0A0A]">{question.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
