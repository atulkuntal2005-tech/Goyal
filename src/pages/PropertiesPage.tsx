import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { EnquiryModal } from '../components/EnquiryModal';

interface PropertiesPageProps {
  onNavigate: (page: string, param?: string) => void;
  initialParams?: string;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ onNavigate, initialParams }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialParams) {
      const params = new URLSearchParams(initialParams);
      if (params.get('search')) setSearch(params.get('search') || '');
      if (params.get('type')) setSelectedType(params.get('type') || 'all');
      if (params.get('purpose')) setSelectedPurpose(params.get('purpose') || 'all');
    }
  }, [initialParams]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Filter logic
  const filtered = properties.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedType !== 'all' && p.propertyType !== selectedType) {
      return false;
    }

    if (selectedPurpose !== 'all' && p.purpose !== selectedPurpose) {
      return false;
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedPurpose('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Verified Real Estate Catalog
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#fbf7ee] font-normal tracking-tight">
            Curated Properties in Mathura &amp; NCR
          </h1>
          <p className="text-sm sm:text-base text-[#a8a195] font-light">
            Browse our verified residential villas, commercial plots, and penthouses. Every listing is audited for clear title deeds and immediate legal registration.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#12141a] p-4 sm:p-6 rounded-2xl border border-[#c5a880]/20 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#dfc499] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by title, location, landmark..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            {/* Property Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs sm:text-sm text-[#ded8cd] focus:outline-none focus:border-[#c5a880] cursor-pointer"
              >
                <option value="all">All Property Types</option>
                <option value="Luxury Villa">Luxury Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Plot / Land">Plot / Land</option>
                <option value="Apartment">Apartment</option>
                <option value="Farmhouse">Farmhouse</option>
              </select>
            </div>

            {/* Purpose */}
            <div>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs sm:text-sm text-[#ded8cd] focus:outline-none focus:border-[#c5a880] cursor-pointer"
              >
                <option value="all">Buy &amp; Rent (All)</option>
                <option value="Sale">For Sale (Buy)</option>
                <option value="Rent">For Rent (Lease)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs sm:text-sm text-[#ded8cd] focus:outline-none focus:border-[#c5a880] cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#a8a195] border-t border-white/5">
            <div>
              Showing <span className="font-semibold text-white tabular-nums">{filtered.length}</span> of{' '}
              <span className="font-semibold text-white tabular-nums">{properties.length}</span> properties
            </div>

            {(search || selectedType !== 'all' || selectedPurpose !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#dfc499] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#a8a195]">Loading verified properties...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <Filter className="w-12 h-12 text-[#a8a195] mx-auto opacity-40" />
            <h3 className="font-serif text-2xl text-[#fbf7ee]">No Properties Found</h3>
            <p className="text-xs sm:text-sm text-[#9c9587]">
              No properties match your current search criteria. Try modifying your filter or clear the filters to view all available listings.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(id) => onNavigate('property-detail', id)}
                onEnquire={(p) => {
                  setSelectedProp(p);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProp}
      />
    </div>
  );
};
