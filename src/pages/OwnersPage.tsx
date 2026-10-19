import React, { useState, useEffect } from 'react';
import { Phone, Mail, Award, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Owner } from '../types';
import { useSettings } from '../context/SettingsContext';

interface OwnersPageProps {
  onNavigate: (page: string) => void;
}

export const OwnersPage: React.FC<OwnersPageProps> = ({ onNavigate }) => {
  const { settings, phoneUrl, whatsappUrl } = useSettings();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOwners() {
      try {
        setLoading(true);
        const res = await fetch('/api/owners');
        if (res.ok) {
          const data = await res.json();
          setOwners(data);
        }
      } catch (err) {
        console.error('Error fetching owners:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOwners();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Leadership &amp; Advisory Board
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#fbf7ee] font-normal tracking-tight">
            Meet Our Owners
          </h1>
          <p className="text-base text-[#a8a195] font-light leading-relaxed">
            Personal leadership, multi-generational market mastery, and absolute legal transparency. Get to know the partners guiding your real estate investments.
          </p>
        </div>

        {/* Owners Profiles Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#a8a195]">Loading owner profiles...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {owners.map((owner, index) => (
              <div
                key={owner.id}
                className="bg-[#12141c] rounded-3xl overflow-hidden border border-[#c5a880]/30 shadow-2xl p-8 sm:p-12 transition-all hover:border-[#c5a880]/60"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Portrait */}
                  <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
                    <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#dfc499]/40 shadow-xl bg-[#191c26]">
                      <img
                        src={owner.photoUrl}
                        alt={owner.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/owner_portrait_one_1792413400191.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#dfc499] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          Profile #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#dfc499]">
                        {owner.designation}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf7ee] font-medium mt-1">
                        {owner.name}
                      </h2>
                      <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#b5ae9f]">
                        <Award className="w-4 h-4 text-[#dfc499]" />
                        <span className="font-medium text-white">{owner.experience}</span>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base text-[#ded8cd] leading-relaxed space-y-3">
                      <p>{owner.bio}</p>
                    </div>

                    {/* Areas of Expertise */}
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-wider text-[#8c8577] block">
                        Specialized Advisory Focus
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {owner.areasOfExpertise.map((exp, i) => (
                          <span
                            key={i}
                            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#ded8cd]"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                      <a
                        href={owner.phone ? `tel:${owner.phone.replace(/[^0-9+]/g, '')}` : phoneUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Direct Call</span>
                      </a>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-xl transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>

                      {owner.email && (
                        <a
                          href={`mailto:${owner.email}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ded8cd] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#dfc499]" />
                          <span>Email: {owner.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Advisory Guarantee Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#12141a] border border-[#c5a880]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfc499]">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Leadership Access</span>
            </div>
            <h3 className="font-serif text-2xl text-white">
              Schedule a One-on-One Property Strategy Meeting
            </h3>
            <p className="text-xs text-[#a8a195] max-w-xl">
              Discuss portfolio allocation, plot acquisitions, or commercial leasing directly with the partners at our Mandi Choraha office.
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-colors cursor-pointer shrink-0"
          >
            Contact the Owners
          </button>
        </div>
      </div>
    </div>
  );
};
