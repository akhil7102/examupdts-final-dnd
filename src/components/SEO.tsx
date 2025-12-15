import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function SEO({ 
  title = 'Examupdts | Fastest JNTUH Exam Updates',
  description = 'Get instant JNTUH exam notifications, results, notes, important questions, jobs, and internships. Your complete academic resource platform for JNTUH students.',
  keywords = 'JNTUH, exam updates, results, notes, important questions, jobs, internships, JNTUH notifications, B.Tech, M.Tech, PharmD, exam timetable',
  ogImage = '/og-image.png',
  ogUrl = window.location.href
}: SEOProps) {
  useEffect(() => {
    // Update page title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', ogUrl, true);
    updateMeta('og:image', ogImage, true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // Additional SEO tags
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'Examupdts');
  }, [title, description, keywords, ogImage, ogUrl]);

  return null;
}