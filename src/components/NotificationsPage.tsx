import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Filter, ExternalLink, Download, Calendar } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { TruncatedContent } from './shared/TruncatedContent';
import { SEO } from './SEO';
import { postsApi, Post } from '../utils/api';

const categories = ['All', 'Exam Update'];

export function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [allUpdates, setAllUpdates] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await postsApi.getAll(selectedCategory === 'All' ? undefined : selectedCategory);
        // Filter published posts
        const published = posts.filter(p => p.status === 'published');
        setAllUpdates(published);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [selectedCategory]);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredUpdates = allUpdates;
  const trendingUpdates = allUpdates.filter(update => update.trending);

  return (
    <>
      <SEO 
        title="JNTUH Notifications & Exam Updates | Examupdts"
        description="Latest JNTUH exam notifications, timetables, and important updates. Stay informed about exams, results, and academic announcements."
        keywords="JNTUH notifications, exam updates, timetable, exam dates, JNTUH exams, academic notifications"
      />
      
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-[#0A0A0A] mb-2">JNTUH Updates</h1>
            <p className="text-[#0A0A0A]/60">Stay informed with the latest notifications and exam updates</p>
          </div>
        </section>

        {/* AdSense Banner */}
        <div className="container mx-auto px-4 py-6">
          <AdSenseSlot format="horizontal" />
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-[#0A0A0A]/60 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-[#004AAD]' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Updates List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredUpdates.length > 0 ? (
                filteredUpdates.map((update) => (
                  <Card key={update.id} className="p-6 hover:shadow-lg transition-all border border-gray-200 bg-white">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                          <Badge className="bg-[#004AAD] text-white">{update.category}</Badge>
                          {update.trending && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#0A0A0A]/60">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(update.date)}
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/post/${update.id}`} className="block">
                        <h3 className="text-[#0A0A0A] hover:text-[#004AAD] transition-colors">
                          {update.title}
                        </h3>
                      </Link>

                      {/* Content with View More */}
                      <TruncatedContent content={update.content} maxHeight={150} title={update.title} />

                      {/* Exam Dates Display */}
                      {update.exam_dates && update.exam_dates.length > 0 && (
                        <div className="mt-4 p-4 bg-[#F5F5F5] rounded-lg space-y-2">
                          <h4 className="text-sm text-[#0A0A0A] flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-[#004AAD]" />
                            Exam Schedule
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {update.exam_dates.map((item, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                                <span className="text-sm text-[#0A0A0A]">{item.subject}</span>
                                <span className="text-sm text-[#004AAD]">{formatExamDate(item.date)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {update.tags && update.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {update.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                        <Link to={`/post/${update.id}`}>
                          <Button size="sm" variant="outline">
                            Read Full Post
                          </Button>
                        </Link>

                        {/* External Link Button */}
                        {update.external_link && (
                          <a 
                            href={update.external_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button 
                              size="sm" 
                              className="bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              OPEN
                            </Button>
                          </a>
                        )}

                        {/* Timetable Download Button */}
                        {update.timetable_link && (
                          <a 
                            href={update.timetable_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#004AAD] text-[#004AAD] hover:bg-[#004AAD] hover:text-white flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Time Table
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center bg-white">
                  <p className="text-[#0A0A0A]/60">No notifications available</p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AdSense Sidebar */}
              <div className="sticky top-20">
                <AdSenseSlot format="vertical" />
              </div>

              {/* Trending Update */}
              {trendingUpdates.length > 0 && (
                <Card className="p-6 bg-white border-2 border-red-500/20">
                  <h3 className="text-[#0A0A0A] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    <span className="text-red-500">Trending Now</span>
                  </h3>
                  <Link
                    to={`/post/${trendingUpdates[0].id}`}
                    className="block p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Badge className="bg-red-500 text-white text-xs">
                        {trendingUpdates[0].category}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-[#0A0A0A] mb-2 line-clamp-3">{trendingUpdates[0].title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#0A0A0A]/60">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(trendingUpdates[0].date)}
                    </div>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}