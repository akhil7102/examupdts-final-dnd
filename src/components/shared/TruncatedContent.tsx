import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { ViewMoreModal } from './ViewMoreModal';

interface TruncatedContentProps {
  content: string;
  maxHeight?: number;
  className?: string;
  title?: string;
}

export function TruncatedContent({ 
  content, 
  maxHeight = 150, 
  className = '',
  title = 'Full Content'
}: TruncatedContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setNeedsTruncation(height > maxHeight);
    }
  }, [content, maxHeight]);

  return (
    <>
      <div className="relative">
        <div
          ref={contentRef}
          className={`${className} overflow-hidden transition-all duration-300`}
          style={{
            maxHeight: needsTruncation ? `${maxHeight}px` : 'none',
          }}
        >
          <div
            className="prose prose-sm max-w-none text-[#0A0A0A]/80"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
          />
        </div>
        
        {needsTruncation && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white pointer-events-none" />
            <div className="mt-2 relative z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-[#004AAD] border-2 border-[#004AAD] hover:bg-[#004AAD] hover:text-white transition-all font-semibold shadow-sm"
              >
                View More
              </Button>
            </div>
          </>
        )}
      </div>

      <ViewMoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        content={content}
      />
    </>
  );
}