import React from 'react';
import { MapPin, Bed, Bath, Maximize2, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { useSettings } from '../context/SettingsContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  onEnquire?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onEnquire }) => {
  const { phoneUrl, getWhatsAppPropertyUrl } = useSettings();
  const whatsAppUrl = getWhatsAppPropertyUrl(property.title);

  return (
    <div className="group relative bg-[#12141a] rounded-2xl overflow-hidden border border-[#c5a880]/20 hover:border-[#c5a880]/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-[#c5a880]/5">
      {/* Property Image & Status Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1c24]">
        <img
          src={property.primaryImage || property.images[0] || '/images/hero_luxury_villa_1792413398505.jpg'}
          alt={property.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const fallback = '/images/hero_luxury_villa_1792413398505.jpg';
            if (e.currentTarget.src !== window.location.origin + fallback) {
              e.currentTarget.src = fallback;
            }
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#dfc499] border border-[#dfc499]/30 font-medium">
            {property.propertyType}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-medium backdrop-blur-md ${
              property.status === 'Available'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
            }`}
          >
            {property.purpose === 'Rent' ? 'For Rent' : 'For Sale'} · {property.status}
          </span>
        </div>

        {/* Price Tag in Bottom Left of Image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] drop-shadow-md">
            {property.priceDisplay}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#a8a195] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#dfc499] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <h3
            onClick={() => onSelect(property.id)}
            className="font-serif text-lg sm:text-xl font-medium text-[#fbf7ee] group-hover:text-[#dfc499] transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {property.title}
          </h3>

          <p className="text-xs text-[#9c9587] line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>

          {/* Key Specifications */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-[#ded8cd] mb-4">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-[#dfc499]" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#a8a195]">
                <span>Commercial</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-[#dfc499]" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
              <Maximize2 className="w-3.5 h-3.5 text-[#dfc499]" />
              <span>{property.areaSqFt.toLocaleString('en-IN')} sq.ft</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          {/* WhatsApp Direct Enquiry */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#25D366]/90 hover:bg-[#25D366] rounded-xl transition-colors shadow-sm"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Direct Phone Call */}
          <a
            href={phoneUrl}
            className="p-2 text-[#dfc499] hover:text-white bg-white/5 hover:bg-[#dfc499]/20 border border-[#c5a880]/30 rounded-xl transition-colors"
            title="Call Advisor"
            aria-label="Call Advisor"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          {/* View Details */}
          <button
            onClick={() => onSelect(property.id)}
            className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium text-[#fbf7ee] bg-[#222633] hover:bg-[#2b3040] rounded-xl transition-colors border border-white/10"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
