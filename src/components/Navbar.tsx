import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, Search } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { settings, phoneUrl, whatsappUrl } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Properties', page: 'properties' },
    { label: 'Our Owners', page: 'owners' },
    { label: 'Services', page: 'services' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#c5a880]/15 py-3 shadow-xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#dfc499] to-[#8c6d3d] flex items-center justify-center text-black font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              SGA
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#f9f6f0] group-hover:text-[#dfc499] transition-colors whitespace-nowrap">
                {settings.businessName || 'Shri Goyal Associates'}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#c5a880]/80 font-sans hidden sm:block">
                Luxury Real Estate &amp; Advisory
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-1 whitespace-nowrap ${
                  currentPage === link.page
                    ? 'text-[#e5caa2] font-semibold'
                    : 'text-[#d6d0c4] hover:text-white'
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Search Properties */}
            <button
              onClick={() => handleLinkClick('properties')}
              aria-label="Search properties"
              className="p-2 text-[#d6d0c4] hover:text-[#e5caa2] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              title="Search Properties"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Direct Call Button */}
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#f4efe6] bg-[#1a1c23] hover:bg-[#252833] border border-[#c5a880]/30 rounded-full transition-all shadow-sm whitespace-nowrap group"
              title={`Call ${settings.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#dfc499] group-hover:rotate-12 transition-transform" />
              <span>Call Now</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-full transition-all shadow-sm hover:shadow-[#25D366]/20 whitespace-nowrap"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleLinkClick('admin')}
              className="p-2 text-white/40 hover:text-[#dfc499] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              title="Admin CMS Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={phoneUrl}
              className="p-2 text-[#dfc499] bg-[#1a1c23] border border-[#c5a880]/30 rounded-full"
              title="Call Now"
              aria-label="Call Now"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-[#25D366] rounded-full"
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-[#dfc499] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#0c0e14] border-b border-[#c5a880]/20 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className={`text-left text-base font-medium py-2 px-3 rounded-md transition-colors ${
                  currentPage === link.page
                    ? 'bg-[#c5a880]/15 text-[#dfc499] font-semibold'
                    : 'text-[#d6d0c4] hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={phoneUrl}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-[#f4efe6] bg-[#1a1c23] border border-[#c5a880]/40 rounded-xl"
            >
              <Phone className="w-4 h-4 text-[#dfc499]" />
              <span>Call Us: {settings.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-[#25D366] rounded-xl"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              onClick={() => handleLinkClick('admin')}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 rounded-xl transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#dfc499]" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
