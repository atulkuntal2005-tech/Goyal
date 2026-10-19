import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Check,
  ShieldCheck,
  Phone,
  MessageCircle,
  FileText,
  Share2,
  Sparkles
} from 'lucide-react';
import { Property } from '../types';
import { useSettings } from '../context/SettingsContext';
import { EnquiryModal } from '../components/EnquiryModal';
import { apiFetch } from '../services/apiBridge';

interface PropertyDetailPageProps {
  propertyId: string;
  onNavigate: (page: string, param?: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId, onNavigate }) => {
  const { settings, phoneUrl, getWhatsAppPropertyUrl } = useSettings();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const res = await apiFetch(`/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        }
      } catch (err) {
        console.error('Error fetching property detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#a8a195]">Loading property specifications...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="font-serif text-3xl text-white">Property Not Found</h2>
          <p className="text-sm text-[#a8a195]">
            The requested property listing is unavailable or has been archived.
          </p>
          <button
            onClick={() => onNavigate('properties')}
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] rounded-xl"
          >
            Return to Properties
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0 ? property.images : [property.primaryImage];
  const whatsAppUrl = getWhatsAppPropertyUrl(property.title);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('properties')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfc499] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-[#a8a195] hover:text-[#dfc499] bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Link Copied!' : 'Share Listing'}</span>
          </button>
        </div>

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#dfc499]/10 text-[#dfc499] border border-[#dfc499]/30 font-medium">
                {property.propertyType}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-[#a8a195] border border-white/10">
                {property.purpose === 'Rent' ? 'For Lease / Rent' : 'For Outright Sale'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                {property.status}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee]">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#a8a195]">
              <MapPin className="w-4 h-4 text-[#dfc499] shrink-0" />
              <span>{property.location}, {property.city}, {property.state} – {property.pincode}</span>
            </div>
          </div>

          <div className="lg:text-right space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#a8a195] block">
              Investment Valuation
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#fbf7ee]">
              {property.priceDisplay}
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-[#161821] border border-white/10 shadow-2xl">
            <img
              src={galleryImages[activeImageIndex] || property.primaryImage}
              alt={property.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const fallback = '/images/hero_luxury_villa_1792413398505.jpg';
                if (e.currentTarget.src !== window.location.origin + fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#dfc499] scale-105 shadow-md' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = '/images/hero_luxury_villa_1792413398505.jpg';
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-Column Specification & Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Left: Detailed Specs & Description */}
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#12141a] border border-white/5">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#8c8577] flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>Total Area</span>
                </span>
                <p className="font-serif text-xl text-white font-medium">
                  {property.areaSqFt.toLocaleString('en-IN')} sq.ft
                </p>
              </div>

              {property.bedrooms > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#8c8577] flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#dfc499]" />
                    <span>Bedrooms</span>
                  </span>
                  <p className="font-serif text-xl text-white font-medium">
                    {property.bedrooms} Luxury Suites
                  </p>
                </div>
              )}

              {property.bathrooms > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#8c8577] flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-[#dfc499]" />
                    <span>Bathrooms</span>
                  </span>
                  <p className="font-serif text-xl text-white font-medium">
                    {property.bathrooms} En-Suite Baths
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#8c8577] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>Availability</span>
                </span>
                <p className="font-serif text-xl text-[#dfc499] font-medium">
                  Immediate
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#fbf7ee]">
                About This Property
              </h2>
              <div className="text-sm sm:text-base text-[#ded8cd] leading-relaxed whitespace-pre-line space-y-4">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-serif text-2xl text-[#fbf7ee]">
                  Features &amp; Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#12141a] border border-white/5 text-xs sm:text-sm text-[#ded8cd]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Title Assurance */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171922] to-[#12141a] border border-[#c5a880]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#dfc499] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Title Verification Guaranteed</span>
              </div>
              <h4 className="font-serif text-lg text-white">
                Audited &amp; Facilitated by Shri Goyal Associates
              </h4>
              <p className="text-xs text-[#a8a195] leading-relaxed">
                This listing is backed by comprehensive revenue record checks, municipal clearances, and full deed scrutiny. Our leadership coordinates the complete legal transition from agreement to stamp duty and registrar mutation.
              </p>
            </div>
          </div>

          {/* Right: Contact & Action Sticky Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#12141a] border border-[#c5a880]/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#dfc499] font-medium block mb-1">
                  Direct Real Estate Advisory
                </span>
                <h3 className="font-serif text-2xl text-[#fbf7ee]">
                  Interested in this asset?
                </h3>
                <p className="text-xs text-[#a8a195] mt-1">
                  Connect with our senior partners for floor plans, registry copies, or a private walkthrough.
                </p>
              </div>

              {/* Call Now Action */}
              <a
                href={phoneUrl}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-all shadow-md group"
              >
                <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Call Now: {settings.phone}</span>
              </a>

              {/* WhatsApp Enquiry Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20b858] rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire via WhatsApp</span>
              </a>

              {/* Inquiry Modal Trigger */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#f4efe6] bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#dfc499]" />
                <span>Schedule Private Site Inspection</span>
              </button>

              <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-[#8c8577]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>Confidential client representation</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>Office: Mandi Choraha, Mathura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
    </div>
  );
};
