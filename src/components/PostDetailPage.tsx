import { useParams, Link } from 'react-router-dom';
import { Clock, Download, TrendingUp, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { SEO } from './SEO';
import { postsApi, Post } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function PostDetailPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const postData = await postsApi.getById(id);
          setPost(postData);
          
          // Fetch trending posts
          const allPosts = await postsApi.getAll();
          const trending = allPosts.filter(p => p.trending && p.id !== id).slice(0, 3);
          setTrendingPosts(trending);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to fetch post');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [id]);

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

  const handleAttachmentDownload = (attachment: { name: string; size: string; url?: string }) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank', 'noopener,noreferrer');
      toast.success(`Downloading ${attachment.name}...`);
    } else {
      toast.error('Download link not available');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#0A0A0A] mb-4">Post not found</h2>
          <Button asChild>
            <Link to="/notifications">Back to Updates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} | Examupdts`}
        description={post.content.substring(0, 160)}
        keywords={post.tags?.join(', ')}
      />
      
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/notifications">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Updates
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Post Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className="bg-[#004AAD] text-white">
                    {post.category}
                  </Badge>
                  {post.trending && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-[#0A0A0A]/60 ml-auto">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(post.date)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-[#0A0A0A] mb-6">{post.title}</h1>

                {/* Full Content */}
                <div className="prose prose-sm max-w-none text-[#0A0A0A]/80 mb-8">
                  <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                </div>

                {/* Exam Dates Section */}
                {post.exam_dates && post.exam_dates.length > 0 && (
                  <Card className="p-6 bg-[#F5F5F5] border-none mb-8">
                    <h3 className="text-lg text-[#0A0A0A] flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-[#004AAD]" />
                      Exam Schedule
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {post.exam_dates.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                          <span className="text-[#0A0A0A]">{item.subject}</span>
                          <span className="text-[#004AAD]">{formatExamDate(item.date)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Action Buttons Section */}
                <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-200">
                  {/* External Link Button */}
                  {post.external_link && (
                    <a 
                      href={post.external_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-[#004AAD] hover:bg-[#003A8C] text-white flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        OPEN LINK
                      </Button>
                    </a>
                  )}

                  {/* Timetable Download Button */}
                  {post.timetable_link && (
                    <a 
                      href={post.timetable_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline"
                        className="border-[#004AAD] text-[#004AAD] hover:bg-[#004AAD] hover:text-white flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Time Table
                      </Button>
                    </a>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm text-[#0A0A0A]/60 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments (Legacy) */}
                {post.attachments && post.attachments.length > 0 && (
                  <div>
                    <h4 className="text-[#0A0A0A] mb-3">Attachments</h4>
                    <div className="space-y-2">
                      {post.attachments.map((attachment, index) => (
                        <button
                          key={index}
                          onClick={() => handleAttachmentDownload(attachment)}
                          className="w-full flex items-center justify-between p-4 bg-[#F5F5F5] hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-[#004AAD]" />
                            <div className="text-left">
                              <p className="text-sm text-[#0A0A0A]">{attachment.name}</p>
                              <p className="text-xs text-[#0A0A0A]/60">{attachment.size}</p>
                            </div>
                          </div>
                          <Button size="sm" className="bg-[#004AAD] hover:bg-[#003A8C]">
                            Download
                          </Button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* AdSense Below Post */}
              <div className="mt-6">
                <AdSenseSlot format="horizontal" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AdSense Sidebar */}
              <div className="sticky top-20">
                <AdSenseSlot format="vertical" />
              </div>

              {/* Related/Trending Posts */}
              {trendingPosts.length > 0 && (
                <Card className="p-6 bg-white">
                  <h3 className="text-[#0A0A0A] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#004AAD]" />
                    Trending Updates
                  </h3>
                  <div className="space-y-3">
                    {trendingPosts.map((trendingPost) => (
                      <Link
                        key={trendingPost.id}
                        to={`/post/${trendingPost.id}`}
                        className="block p-3 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                      >
                        <p className="text-sm text-[#0A0A0A] mb-1 line-clamp-2">
                          {trendingPost.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#0A0A0A]/60">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(trendingPost.date)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}