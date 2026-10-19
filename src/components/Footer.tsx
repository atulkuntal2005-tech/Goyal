import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Navigation, ExternalLink, Shield } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, phoneUrl, emailUrl, whatsappUrl, formattedAddress } = useSettings();

  const handleLink = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090c] text-[#ded8cd] border-t border-[#c5a880]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Introduction */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfc499] to-[#8c6d3d] flex items-center justify-center text-black font-serif font-bold text-base">
                SGA
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight text-[#fbf7ee]">
                {settings.businessName}
              </span>
            </div>
            <p className="text-sm text-[#a8a195] leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-xs text-[#8c8577]">
              Premier property consultancy offering verified luxury villas, strategic commercial land, and residential plot advisory in Mathura, Vrindavan, and NCR.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-serif text-lg text-[#fbf7ee] mb-4 tracking-wide border-b border-white/5 pb-2">
              Exploration
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  About Our Firm
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('properties')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  Featured Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('owners')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  Meet Our Owners
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  Advisory Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="text-[#b5ae9f] hover:text-[#dfc499] transition-colors"
                >
                  Contact &amp; Location
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div>
            <h4 className="font-serif text-lg text-[#fbf7ee] mb-4 tracking-wide border-b border-white/5 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3.5 text-sm">
              <a
                href={phoneUrl}
                className="flex items-center gap-3 text-[#ded8cd] hover:text-[#dfc499] transition-colors group"
                title={`Call ${settings.phone}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#dfc499]/20">
                  <Phone className="w-4 h-4 text-[#dfc499]" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#8c8577]">Direct Phone</span>
                  <span className="font-medium">{settings.phone}</span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#ded8cd] hover:text-[#25D366] transition-colors group"
                title="WhatsApp Advisory"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20">
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#8c8577]">WhatsApp Desk</span>
                  <span className="font-medium">{settings.whatsapp}</span>
                </div>
              </a>

              <a
                href={emailUrl}
                className="flex items-center gap-3 text-[#ded8cd] hover:text-[#dfc499] transition-colors group"
                title={`Email ${settings.email}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#dfc499]/20">
                  <Mail className="w-4 h-4 text-[#dfc499]" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#8c8577]">Official Email</span>
                  <span className="font-medium break-all">{settings.email}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Office Address & Business Hours */}
          <div>
            <h4 className="font-serif text-lg text-[#fbf7ee] mb-4 tracking-wide border-b border-white/5 pb-2">
              Registered Office
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#dfc499] shrink-0 mt-1" />
                <span className="text-[#a8a195] leading-relaxed">
                  {formattedAddress}
                </span>
              </div>

              {settings.businessHours && (
                <div className="text-xs text-[#8c8577] pt-1">
                  <span className="font-medium text-[#b5ae9f]">Hours:</span> {settings.businessHours}
                </div>
              )}

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#dfc499] hover:text-white bg-[#dfc499]/10 hover:bg-[#dfc499]/20 rounded-md transition-all border border-[#dfc499]/30"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c8577]">
          <p>
            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved. RERA &amp; Legal Compliance Standards Enforced.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLink('privacy')}
              className="hover:text-[#dfc499] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLink('terms')}
              className="hover:text-[#dfc499] transition-colors"
            >
              Terms of Advisory
            </button>
            <button
              onClick={() => handleLink('admin')}
              className="inline-flex items-center gap-1.5 hover:text-[#dfc499] transition-colors text-white/50"
            >
              <Shield className="w-3 h-3" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
