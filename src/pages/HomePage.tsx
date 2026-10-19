import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Building,
  CheckCircle2,
  Search,
  ExternalLink,
  Navigation,
  Send,
  AlertCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Property, Owner, Service, Testimonial } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { EnquiryModal } from '../components/EnquiryModal';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings, phoneUrl, whatsappUrl, formattedAddress } = useSettings();

  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar States
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchPurpose, setSearchPurpose] = useState<'Sale' | 'Rent'>('Sale');

  // Modal State
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inline Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [propsRes, ownersRes, servicesRes, testRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/owners'),
          fetch('/api/services'),
          fetch('/api/testimonials')
        ]);

        if (propsRes.ok) setProperties(await propsRes.json());
        if (ownersRes.ok) setOwners(await ownersRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (testRes.ok) setTestimonials(await testRes.json());
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('properties', `purpose=${searchPurpose}&type=${searchType}&search=${encodeURIComponent(searchLocation)}`);
  };

  const handleInlineContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      setContactError('Please fill in all required fields.');
      return;
    }

    try {
      setContactLoading(true);
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contactName.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim(),
          enquiryType: 'General Inquiry',
          message: contactMsg.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      setContactSubmitted(true);
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setContactMsg('');
    } catch (err: any) {
      setContactError(err.message || 'Error sending message.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df]">
      {/* =========================================================================
          HERO SECTION (Cinematic Editorial, Inspired by Reference Image)
      ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroBgImage || '/src/assets/images/hero_luxury_villa_1792413398505.jpg'}
            alt="Luxury Architectural Estate"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/src/assets/images/hero_luxury_villa_1792413398505.jpg';
            }}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d11] via-black/55 to-black/75" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#c5a880]/30 text-xs text-[#dfc499] uppercase tracking-widest font-medium">
            <span>Exclusive Property Advisory</span>
            <span aria-hidden="true">·</span>
            <span>Mathura &amp; NCR</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#fbf7ee] max-w-4xl mx-auto leading-[1.08] drop-shadow-xl text-balance">
            {settings.heroHeadline}
          </h1>

          <p className="text-base sm:text-xl text-[#ded8cd] max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
            {settings.heroSubtitle}
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('properties')}
              className="px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-all shadow-lg hover:shadow-[#dfc499]/20 cursor-pointer"
            >
              {settings.heroCta1Text || 'Explore Properties'}
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#fbf7ee] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all cursor-pointer"
            >
              {settings.heroCta2Text || 'Contact Us'}
            </button>

            <a
              href={phoneUrl}
              className="px-5 py-3.5 text-xs uppercase tracking-wider font-medium text-[#dfc499] hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md border border-[#c5a880]/40 rounded-full transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Call</span>
            </a>
          </div>

          {/* Integrated Luxury Search Bar */}
          <div className="pt-8 max-w-4xl mx-auto w-full">
            <form
              onSubmit={handleHeroSearch}
              className="glass-panel p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-3"
            >
              {/* Buy / Rent Switch */}
              <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setSearchPurpose('Sale')}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    searchPurpose === 'Sale'
                      ? 'bg-[#dfc499] text-black shadow-md'
                      : 'text-[#d6d0c4] hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSearchPurpose('Rent')}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    searchPurpose === 'Rent'
                      ? 'bg-[#dfc499] text-black shadow-md'
                      : 'text-[#d6d0c4] hover:text-white'
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* Property Type Dropdown */}
              <div className="w-full sm:w-48">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-xs text-[#ede8df] border-none focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#191c24] text-white">All Property Types</option>
                  <option value="Luxury Villa" className="bg-[#191c24] text-white">Luxury Villa</option>
                  <option value="Penthouse" className="bg-[#191c24] text-white">Penthouse</option>
                  <option value="Commercial Space" className="bg-[#191c24] text-white">Commercial Space</option>
                  <option value="Plot / Land" className="bg-[#191c24] text-white">Plot / Land</option>
                  <option value="Apartment" className="bg-[#191c24] text-white">Apartment</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="w-full flex-1 flex items-center px-2">
                <Search className="w-4 h-4 text-[#dfc499] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Location (e.g. Mandi Choraha, Narsi Vihar, Vrindavan)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Hero Proof Metrics Strip */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-white/10 pt-6">
            <div className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-[#fbf7ee] tabular-nums">
                {settings.heroStat1Number}
              </span>
              <p className="text-xs text-[#a8a195] uppercase tracking-wider">
                {settings.heroStat1Label}
              </p>
            </div>
            <div className="space-y-1 md:border-x border-white/10">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-[#fbf7ee] tabular-nums">
                {settings.heroStat2Number}
              </span>
              <p className="text-xs text-[#a8a195] uppercase tracking-wider">
                {settings.heroStat2Label}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-[#fbf7ee] tabular-nums">
                {settings.heroStat3Number}
              </span>
              <p className="text-xs text-[#a8a195] uppercase tracking-wider">
                {settings.heroStat3Label}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EXPERIENCE EXCELLENCE IN REAL ESTATE (From Reference Image)
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Heritage &amp; Expertise
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee] tracking-tight">
            Experience Excellence In Real Estate
          </h2>
          <p className="text-sm text-[#b5ae9f]">
            {settings.aboutSubtitle}
          </p>
        </div>

        {/* 3-Column Editorial Grid matching Reference Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & About Action */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf7ee] leading-snug">
              {settings.aboutHeading}
            </h3>
            <p className="text-sm text-[#a8a195] leading-relaxed">
              {settings.aboutText}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 text-xs uppercase tracking-wider font-medium text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-colors cursor-pointer"
              >
                About Our Firm
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8c8577]">
                Institutional Trust &amp; Standards
              </span>
              <div className="flex items-center gap-4 text-xs text-[#b5ae9f]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#dfc499]" />
                  <span>Verified Legal Deeds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#dfc499]" />
                  <span>RERA Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Architectural Imagery */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#c5a880]/30 aspect-[3/4] shadow-2xl group">
              <img
                src={settings.aboutImage || '/src/assets/images/about_architecture_craft_1792413399389.jpg'}
                alt="Architecture and Interiors"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/about_architecture_craft_1792413399389.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs text-[#dfc499] uppercase tracking-widest font-medium">
                  Mathura · Vrindavan · NCR
                </span>
                <p className="font-serif text-lg text-white font-medium mt-1">
                  Bespoke Advisory for Generational Assets
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Expert Guidance & Highlights */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-2 border-b border-white/5 pb-6">
              <h4 className="font-serif text-xl text-[#fbf7ee]">
                Expert Local Guidance
              </h4>
              <p className="text-xs text-[#a8a195] leading-relaxed">
                Our seasoned property partners provide confidential, personalized support across high-growth corridors, historical enclaves, and commercial highway plots.
              </p>
            </div>

            <div className="space-y-2 border-b border-white/5 pb-6">
              <h4 className="font-serif text-xl text-[#fbf7ee]">
                Curated Property Portfolio
              </h4>
              <p className="text-xs text-[#a8a195] leading-relaxed">
                From luxury penthouses and ancestral estates to strategically located roadside commercial plazas, every asset undergoes extensive vetting.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-[#8c8577]">
                Client Satisfaction
              </span>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#dfc499] text-black font-serif font-bold text-xs flex items-center justify-center border-2 border-[#0c0d11]">
                    SG
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#3b4252] text-white text-xs flex items-center justify-center border-2 border-[#0c0d11]">
                    RA
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#5e81ac] text-white text-xs flex items-center justify-center border-2 border-[#0c0d11]">
                    VS
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">4.9 / 5.0 Rating</div>
                  <div className="text-[11px] text-[#8c8577]">Hundreds of families &amp; investors guided</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MEET OUR OWNERS (Prominent Profile Cards)
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090a0d] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
                Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee] tracking-tight">
                Meet Our Owners
              </h2>
              <p className="text-sm text-[#b5ae9f] max-w-xl">
                The visionary stewards behind Shri Goyal Associates. Uncompromising ethics, legal vigilance, and generational client trust.
              </p>
            </div>

            <button
              onClick={() => onNavigate('owners')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#fbf7ee] bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>View Detailed Profiles</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#dfc499]" />
            </button>
          </div>

          {/* Owner Profile Cards (2 Initial Owners) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {owners.slice(0, 2).map((owner) => (
              <div
                key={owner.id}
                className="bg-[#12141c] rounded-3xl overflow-hidden border border-[#c5a880]/20 hover:border-[#c5a880]/40 transition-all p-6 sm:p-8 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#dfc499]/30 shrink-0 bg-[#1c1f2b]">
                      <img
                        src={owner.photoUrl}
                        alt={owner.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/owner_portrait_one_1792413400191.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#fbf7ee]">
                        {owner.name}
                      </h3>
                      <p className="text-xs text-[#dfc499] font-medium uppercase tracking-wider mt-1">
                        {owner.designation}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#b5ae9f]">
                        <Award className="w-3.5 h-3.5 text-[#dfc499]" />
                        <span>{owner.experience}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#b5ae9f] leading-relaxed mb-6">
                    {owner.bio}
                  </p>

                  {/* Areas of Expertise */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] uppercase tracking-wider text-[#8c8577]">
                      Areas of Advisory Focus
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {owner.areasOfExpertise.map((exp, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#ded8cd]"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <a
                    href={phoneUrl}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#fbf7ee] hover:text-[#dfc499] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#dfc499]" />
                    <span>Call: {owner.phone || settings.phone}</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED PROPERTIES
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee] tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-[#b5ae9f] max-w-xl">
              Explore our handpicked collection of prime residential villas, luxury penthouses, and strategic commercial land plots.
            </p>
          </div>

          <button
            onClick={() => onNavigate('properties')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#fbf7ee] bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Browse All Listings ({properties.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#dfc499]" />
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={(id) => onNavigate('property-detail', id)}
              onEnquire={(prop) => {
                setSelectedPropertyForModal(prop);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY CHOOSE US
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090a0d] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
              The Shri Goyal Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#fbf7ee]">
              {settings.whyChooseHeading}
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a195]">
              {settings.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#12141a] border border-white/5 hover:border-[#c5a880]/30 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 flex items-center justify-center text-[#dfc499]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#fbf7ee]">100% Verified Titles</h3>
              <p className="text-xs text-[#9c9587] leading-relaxed">
                Rigorous 30-year revenue record searches, municipal registry audits, and non-encumbrance legal checks before any listing is represented.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141a] border border-white/5 hover:border-[#c5a880]/30 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 flex items-center justify-center text-[#dfc499]">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#fbf7ee]">Deep Regional Mastery</h3>
              <p className="text-xs text-[#9c9587] leading-relaxed">
                Over 24 years navigating Mathura, Vrindavan, NH-19, and Yamuna Expressway growth corridors with insider market knowledge.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141a] border border-white/5 hover:border-[#c5a880]/30 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 flex items-center justify-center text-[#dfc499]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#fbf7ee]">Transparent Pricing</h3>
              <p className="text-xs text-[#9c9587] leading-relaxed">
                Direct buyer-seller negotiation without hidden developer markups or artificial inflation. Absolute fiscal integrity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141a] border border-white/5 hover:border-[#c5a880]/30 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 flex items-center justify-center text-[#dfc499]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#fbf7ee]">Bespoke Client Care</h3>
              <p className="text-xs text-[#9c9587] leading-relaxed">
                Private chauffeured site inspections, Vastu spatial consultation, registry facilitation, and ongoing NRI property portfolio management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CURATED SERVICES
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee]">
            Comprehensive Real Estate Advisory
          </h2>
          <p className="text-sm text-[#b5ae9f]">
            Structured services catering to private homeowners, commercial enterprises, and institutional land buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-8 rounded-3xl bg-[#12141a] border border-white/5 hover:border-[#c5a880]/30 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-4">
                <span className="font-serif text-2xl font-light text-[#dfc499]/50 group-hover:text-[#dfc499] transition-colors">
                  0{service.orderIndex}.
                </span>
                <h3 className="font-serif text-xl font-medium text-[#fbf7ee]">
                  {service.title}
                </h3>
                <p className="text-xs text-[#9c9587] leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    setSelectedPropertyForModal(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#dfc499] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Enquire for Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CLIENT TESTIMONIALS
      ========================================================================= */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090a0d] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
                Client Testimonials
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#fbf7ee]">
                Endorsements of Trust
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-8 rounded-3xl bg-[#12141c] border border-[#c5a880]/20 flex flex-col justify-between shadow-lg"
                >
                  <p className="text-xs sm:text-sm text-[#ded8cd] leading-relaxed italic mb-6">
                    &ldquo;{t.comment}&rdquo;
                  </p>

                  <div className="pt-4 border-t border-white/5">
                    <h4 className="font-serif text-base text-[#fbf7ee] font-medium">
                      {t.clientName}
                    </h4>
                    <p className="text-[11px] text-[#dfc499]">
                      {t.designation} · {t.propertyOrLocation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8: CALL-TO-ACTION SECTION
      ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-[#171922] via-[#101217] to-[#171922] border-y border-[#c5a880]/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Begin Your Property Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#fbf7ee] tracking-tight">
            {settings.contactHeading || "Let's Find the Right Property for You."}
          </h2>
          <p className="text-sm text-[#ded8cd] max-w-2xl mx-auto leading-relaxed">
            {settings.contactDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-all shadow-lg"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Us: {settings.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-full transition-all shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={() => {
                setSelectedPropertyForModal(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#fbf7ee] bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all cursor-pointer"
            >
              <span>Send an Enquiry</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: CONTACT & OFFICE LOCATION
      ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Office Address & Live Map */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
                Visit Our Mathura Office
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf7ee] mt-1">
                Office &amp; Directions
              </h2>
              <p className="text-xs sm:text-sm text-[#a8a195] mt-2">
                Situated at the central Mandi Choraha near Narsi Vihar. We welcome appointments for private property discussions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141a] border border-white/5 space-y-3">
              <div className="text-xs text-[#8c8577] uppercase tracking-wider">
                Physical Address
              </div>
              <p className="text-sm font-medium text-[#fbf7ee] leading-relaxed">
                {formattedAddress}
              </p>

              {settings.officeLandmark && (
                <p className="text-xs text-[#dfc499]">
                  Landmark: {settings.officeLandmark}
                </p>
              )}

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] bg-[#1a1c24] relative shadow-lg">
              <iframe
                title="Office Location Map"
                src={settings.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Quick Contact Form */}
          <div className="lg:col-span-6 bg-[#12141a] p-8 sm:p-10 rounded-3xl border border-[#c5a880]/20 shadow-2xl">
            <h3 className="font-serif text-2xl font-medium text-[#fbf7ee] mb-2">
              Send an Advisory Request
            </h3>
            <p className="text-xs text-[#a8a195] mb-6">
              Leave your details below and our senior partners will respond promptly.
            </p>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-xl text-white">Thank You</h4>
                <p className="text-xs text-emerald-200">
                  Your inquiry has been received. Our leadership will contact you shortly.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="px-4 py-2 text-xs text-white bg-white/10 rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInlineContactSubmit} className="space-y-4">
                {contactError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{contactError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your property requirements, budget, or preferred location in Mathura/NCR..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {contactLoading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedPropertyForModal}
      />
    </div>
  );
};
