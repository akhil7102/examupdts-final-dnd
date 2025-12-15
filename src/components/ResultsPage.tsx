import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LoadingScreen } from './LoadingScreen';
import { ResultModal } from './shared/ResultModal';
import { resultsApi, Result } from '../utils/api';
import { toast } from 'sonner';

export function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resultUpdates, setResultUpdates] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (result: Result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedResult(null), 300);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await resultsApi.getAll();
        setResultUpdates(results);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setResultUpdates([]);
        toast.error('Failed to fetch results. Please try again later.');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  const filteredResults = resultUpdates.filter((result) => {
    const matchesSearch = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.exam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDownload = (result: Result, server: 'server1' | 'server2' | 'legacy') => {
    let link: string | undefined;
    switch (server) {
      case 'server1':
        link = result.server1_link;
        break;
      case 'server2':
        link = result.server2_link;
        break;
      default:
        link = result.pdfLink;
        break;
    }
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
      toast.success('Opening result PDF...');
    } else {
      toast.error('PDF link not available');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-[#0A0A0A] mb-2">JNTUH Results</h1>
          <p className="text-[#0A0A0A]/60">Check and download your examination results</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0A0A]/40" />
            <Input
              type="text"
              placeholder="Search by exam name or semester..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2">
            {filteredResults.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleOpenModal(result)}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        {result.status}
                      </Badge>
                      <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                        {result.exam}
                      </Badge>
                    </div>

                    <h3 className="text-[#0A0A0A] mb-3">{result.title}</h3>
                    
                    {/* Description */}
                    {result.description && (
                      <p className="text-[#0A0A0A]/70 text-sm mb-3 line-clamp-3 flex-1">
                        {result.description}
                      </p>
                    )}
                    
                    <p className="text-[#0A0A0A]/60 text-sm mb-4">
                      Published on {new Date(result.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>

                    {/* Quick Actions */}
                    <div className="space-y-2 mt-auto">
                      <div className="text-[#004AAD] text-sm flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>Click to view details and download</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-[#0A0A0A]/60">No results found matching your search.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AdSense Sidebar */}
            <div className="sticky top-20">
              <AdSenseSlot format="vertical" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        result={selectedResult}
      />
    </div>
  );
}