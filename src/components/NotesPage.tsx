import { useState, useEffect } from 'react';
import { BookOpen, Download, Eye, FileText, FileSpreadsheet, Video, AlertCircle, Filter } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LoadingScreen } from './LoadingScreen';
import { NoteModal } from './shared/NoteModal';
import { notesApi, Note } from '../utils/api';
import { toast } from 'sonner@2.0.3';

const courses = ['All', 'B.Tech', 'B.Pharm', 'M.Tech', 'MBA'];

const yearsByCourse: Record<string, string[]> = {
  'B.Tech': ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
  'B.Pharm': ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
  'M.Tech': ['All', '1st Year', '2nd Year'],
  'MBA': ['All', '1st Year', '2nd Year'],
};

export function NotesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedNote(null), 300);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [selectedCourse, selectedYear, notesData]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const notes = await notesApi.getAll();
      setNotesData(notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotesData([]);
      toast.error('Failed to load notes');
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const filterNotes = () => {
    let filtered = [...notesData];

    // Filter by course
    if (selectedCourse !== 'All') {
      filtered = filtered.filter(note => note.course === selectedCourse);
    }

    // Filter by year
    if (selectedYear !== 'All') {
      filtered = filtered.filter(note => note.year === selectedYear);
    }

    setFilteredNotes(filtered);
  };

  const handleCourseChange = (course: string) => {
    setSelectedCourse(course);
    // Reset year when course changes
    setSelectedYear('All');
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toUpperCase();
    if (type === 'PDF') return <FileText className="w-16 h-16 text-white/80" />;
    if (type === 'DOC' || type === 'DOCX') return <FileSpreadsheet className="w-16 h-16 text-white/80" />;
    if (type === 'PPT' || type === 'PPTX') return <FileSpreadsheet className="w-16 h-16 text-white/80" />;
    if (type === 'VIDEO' || type === 'MP4') return <Video className="w-16 h-16 text-white/80" />;
    return <BookOpen className="w-16 h-16 text-white/80" />;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

  const handlePreview = async (note: Note) => {
    if (!note.file_url || !isValidUrl(note.file_url)) {
      toast.error('Invalid preview link. Please contact the admin of the site.');
      return;
    }

    const fileType = getFileTypeFromUrl(note.file_url);

    try {
      if (fileType === 'youtube') {
        // Open YouTube links in YouTube app or browser
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening video...');
      } else if (fileType === 'google-docs' || fileType === 'google-slides' || fileType === 'google-sheets') {
        // Open Google Docs/Slides/Sheets in new tab
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening document...');
      } else if (fileType === 'pdf') {
        // For PDF files, try to open with PDF viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`;
        window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening PDF...');
      } else if (fileType === 'doc' || fileType === 'ppt') {
        // For Office documents, use Google Docs viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`;
        window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening document...');
      } else if (fileType === 'video') {
        // For video files, open directly
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening video...');
      } else {
        // For unknown types, just open in new tab
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening file...');
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview. Please try downloading instead.');
    }
  };

  const handleDownload = async (note: Note) => {
    if (!note.file_url || !isValidUrl(note.file_url)) {
      toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
      return;
    }

    try {
      // Check if the URL is accessible
      const response = await fetch(note.file_url, { method: 'HEAD' });
      
      if (!response.ok) {
        toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
          duration: 5000,
          icon: <AlertCircle className="w-5 h-5" />,
        });
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = note.file_url;
      link.download = note.title || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${note.title}...`);

      // Increment download count (optional - update in database)
      // You can add an API call here to increment the download count
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
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
          <h1 className="text-[#0A0A0A] mb-2">Study Notes</h1>
          <p className="text-[#0A0A0A]/60">Download comprehensive notes for all subjects</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Filters */}
      <section className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#004AAD]" />
            <h2 className="text-[#0A0A0A] text-lg">Filter Notes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-sm text-[#0A0A0A] mb-2">Course</label>
              <div className="flex flex-wrap gap-2">
                {courses.map((course) => (
                  <Button
                    key={course}
                    onClick={() => handleCourseChange(course)}
                    variant={selectedCourse === course ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCourse === course ? 'bg-[#004AAD] text-white' : ''}
                  >
                    {course}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Filter - Only show when a specific course is selected */}
            {selectedCourse !== 'All' && yearsByCourse[selectedCourse] && (
              <div>
                <label className="block text-sm text-[#0A0A0A] mb-2">Year</label>
                <div className="flex flex-wrap gap-2">
                  {yearsByCourse[selectedCourse].map((year) => (
                    <Button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      variant={selectedYear === year ? 'default' : 'outline'}
                      size="sm"
                      className={selectedYear === year ? 'bg-[#004AAD] text-white' : ''}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCourse !== 'All' || selectedYear !== 'All') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-[#0A0A0A]/60">
                <span>Showing:</span>
                {selectedCourse !== 'All' && (
                  <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                    {selectedCourse}
                  </Badge>
                )}
                {selectedYear !== 'All' && (
                  <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                    {selectedYear}
                  </Badge>
                )}
                <span>({filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'})</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Notes Grid */}
      <section className="container mx-auto px-4 py-8">
        {notesData.length > 0 ? (
          filteredNotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleOpenModal(note)}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col min-h-[420px] cursor-pointer"
                >
                  {/* Preview Area */}
                  <div className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] h-40 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(note.file_type)}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-[#0A0A0A] mb-1 line-clamp-1" title={note.title}>
                        {note.title}
                      </h3>
                      <p className="text-[#0A0A0A]/60 text-sm line-clamp-1">{note.subject}</p>
                      <p className="text-[#0A0A0A]/50 text-xs line-clamp-1">{note.topic}</p>
                      {note.course && note.year && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 text-xs">
                            {note.course}
                          </Badge>
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 text-xs">
                            {note.year}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs">
                        {note.file_type}
                      </Badge>
                      <span className="text-[#0A0A0A]/40 text-xs">{note.fileSize}</span>
                    </div>

                    <div className="text-[#0A0A0A]/40 text-xs">
                      {note.downloads.toLocaleString()} downloads • {note.uploadDate}
                    </div>

                    <div className="text-[#004AAD] text-sm flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Click to view details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
              <p className="text-[#0A0A0A]/60">No notes found for the selected filters.</p>
              <p className="text-[#0A0A0A]/40 mt-2">Try selecting different filters!</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BookOpen className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/60">No notes available yet.</p>
            <p className="text-[#0A0A0A]/40 mt-2">Check back later for study materials!</p>
          </div>
        )}
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
      />
    </div>
  );
}