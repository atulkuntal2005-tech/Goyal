import React, { useState, useEffect } from 'react';
import { Home, Building2, MapPin, Key, TrendingUp, Compass, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Service } from '../types';
import { useSettings } from '../context/SettingsContext';
import { EnquiryModal } from '../components/EnquiryModal';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  MapPin: <MapPin className="w-6 h-6" />,
  Key: <Key className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />
};

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { settings, phoneUrl, whatsappUrl } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('General Advisory');

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleEnquireService = (title: string) => {
    setSelectedServiceTitle(title);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Capabilities &amp; Practice Areas
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#fbf7ee] font-normal tracking-tight">
            Comprehensive Real Estate Advisory
          </h1>
          <p className="text-base text-[#a8a195] font-light leading-relaxed">
            From luxury residential villas to high-footfall commercial roadside plots, our bespoke advisory services cover every facet of acquisition, leasing, and strategic investment.
          </p>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#a8a195]">Loading advisory services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[#12141a] rounded-3xl p-8 border border-white/5 hover:border-[#c5a880]/30 transition-all flex flex-col justify-between shadow-xl group"
              >
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center border border-[#dfc499]/20 group-hover:bg-[#dfc499] group-hover:text-black transition-colors">
                    {iconMap[service.icon] || <Home className="w-6 h-6" />}
                  </div>

                  <span className="font-serif text-xs uppercase tracking-widest text-[#8c8577] block">
                    Practice #{service.orderIndex}
                  </span>

                  <h3 className="font-serif text-2xl text-[#fbf7ee] font-medium">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#ded8cd] leading-relaxed">
                    {service.detailedDescription || service.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-8 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleEnquireService(service.title)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#dfc499] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Site Visit Booking Feature Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#171922] via-[#12141a] to-[#171922] border border-[#c5a880]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
              Chauffeured Property Inspections
            </span>
            <h3 className="font-serif text-3xl text-white">
              Book a Curated Private Site Visit
            </h3>
            <p className="text-sm text-[#a8a195] leading-relaxed">
              We arrange discreet, personalized property site tours with a senior partner. Inspect the neighbourhood, verify road access, review municipal master plans, and examine boundary markers in person.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href={phoneUrl}
              className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-all inline-flex items-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {settings.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-full transition-all inline-flex items-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Booking</span>
            </a>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultEnquiryType={selectedServiceTitle}
      />
    </div>
  );
};
