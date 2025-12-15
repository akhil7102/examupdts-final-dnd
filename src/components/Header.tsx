import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Home, FileText, Award, Briefcase, Video, BookOpen, HelpCircle, Instagram, Twitter, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Social Media Links Configuration
const socialLinks = [
  { 
    name: 'Instagram', 
    icon: Instagram, 
    url: 'https://www.instagram.com/examupdt?igsh=MXhiNXl1ZHQ1N2Rmag==',
    color: 'hover:text-pink-600'
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    url: 'https://x.com/examupdt?t=-Xg9lH8_6kAQzTt6rKGwLA&s=09',
    color: 'hover:text-blue-400'
  },
  { 
    name: 'WhatsApp', 
    icon: WhatsAppIcon, 
    url: 'https://whatsapp.com/channel/0029Va9Mkx1JZg4AgZ9fnv12',
    color: 'hover:text-green-600'
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const location = useLocation();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFollowModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFollowModalOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/notifications', label: 'Updates', icon: Bell },
    { path: '/results', label: 'Results', icon: Award },
    { path: '/notes', label: 'Notes', icon: BookOpen },
    { path: '/jobs-internships', label: 'Jobs', icon: Briefcase },
    { path: '/youtube', label: 'Videos', icon: Video },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Examupdt Logo" className="h-12 w-12 object-contain" />
            <span className="text-[#0A0A0A] tracking-tight">EXAMUPDT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#004AAD] text-white'
                      : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Follow Us Button */}
          <div className="hidden lg:flex items-center">
            <Button
              onClick={() => setIsFollowModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#004AAD] text-white hover:bg-[#003A8C] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Follow Us</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#004AAD] text-white'
                      : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Follow Us Button Mobile */}
            <Button
              onClick={() => {
                setIsMenuOpen(false);
                setIsFollowModalOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#004AAD] text-white hover:bg-[#003A8C] transition-colors w-full"
            >
              <Users className="w-5 h-5" />
              <span>Follow Us</span>
            </Button>
          </nav>
        )}
      </div>

      {/* Follow Us Modal */}
      {isFollowModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden"
          onClick={() => setIsFollowModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFollowModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#0A0A0A]/60" />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#004AAD]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#004AAD]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Follow Us</h2>
              <p className="text-[#0A0A0A]/60">Stay connected with us on social media for the latest updates!</p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsFollowModalOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#004AAD] hover:bg-[#004AAD]/5 transition-all group"
                  >
                    <div className={`p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors`}>
                      <Icon className={`w-6 h-6 text-[#0A0A0A]/60 transition-colors ${social.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-[#0A0A0A]">{social.name}</h3>
                      <p className="text-sm text-[#0A0A0A]/60">Follow us on {social.name}</p>
                    </div>
                    <svg className="w-5 h-5 text-[#0A0A0A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                );
              })}
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setIsFollowModalOpen(false)}
              variant="outline"
              className="w-full mt-6"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}