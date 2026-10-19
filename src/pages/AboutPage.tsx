import React from 'react';
import { Award, ShieldCheck, Users, Building, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            About Shri Goyal Associates
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#fbf7ee] font-normal tracking-tight">
            Over Two Decades of Uncompromising Property Advisory
          </h1>
          <p className="text-base text-[#a8a195] font-light leading-relaxed">
            Headquartered at Mandi Choraha, Mathura, Shri Goyal Associates represents distinguished individuals, families, and commercial enterprises seeking high-value real estate assets backed by impeccable legal security.
          </p>
        </div>

        {/* Hero Split Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf7ee]">
              Our Heritage &amp; Ethos
            </h2>
            <p className="text-sm sm:text-base text-[#ded8cd] leading-relaxed">
              Founded on the foundational principle that real estate is not merely a financial transaction but a generational store of wealth, Shri Goyal Associates has grown to become Mathura and NCR’s most trusted boutique consultancy.
            </p>
            <p className="text-sm sm:text-base text-[#ded8cd] leading-relaxed">
              In a market often characterized by ambiguous land titles and non-transparent brokerages, our firm established an uncompromising standard: zero compromise on legal documentation, verified revenue records, and complete transparency between buyers and sellers.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl font-bold text-[#dfc499] tabular-nums">24+</span>
                <p className="text-xs text-[#8c8577] uppercase tracking-wider">Years Experience</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="font-serif text-3xl font-bold text-[#dfc499] tabular-nums">100%</span>
                <p className="text-xs text-[#8c8577] uppercase tracking-wider">Verified Title Records</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="font-serif text-3xl font-bold text-[#dfc499] tabular-nums">1,200+</span>
                <p className="text-xs text-[#8c8577] uppercase tracking-wider">Client Transactions</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-[#c5a880]/30 aspect-[4/3] shadow-2xl">
              <img
                src={settings.aboutImage || '/images/about_architecture_craft_1792413399389.jpg'}
                alt="Shri Goyal Associates Architecture & Lounge"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const fallback = '/images/about_architecture_craft_1792413399389.jpg';
                  if (e.currentTarget.src !== window.location.origin + fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pillars of Integrity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="p-8 rounded-3xl bg-[#12141a] border border-white/5 space-y-4">
            <ShieldCheck className="w-8 h-8 text-[#dfc499]" />
            <h3 className="font-serif text-2xl text-[#fbf7ee]">Legal Diligence First</h3>
            <p className="text-xs sm:text-sm text-[#9c9587] leading-relaxed">
              Every property represented by our firm undergoes a comprehensive title search spanning thirty years, certified non-encumbrance verification, and zoning clearance before being presented to clients.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#12141a] border border-white/5 space-y-4">
            <Building className="w-8 h-8 text-[#dfc499]" />
            <h3 className="font-serif text-2xl text-[#fbf7ee]">Regional Dominance</h3>
            <p className="text-xs sm:text-sm text-[#9c9587] leading-relaxed">
              Our roots run deep in Mathura, the sacred Vrindavan corridor, and along the Yamuna Expressway and NH-19 industrial belt. We understand micro-market trends and future civic master plans.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#12141a] border border-white/5 space-y-4">
            <Users className="w-8 h-8 text-[#dfc499]" />
            <h3 className="font-serif text-2xl text-[#fbf7ee]">White-Glove Advisory</h3>
            <p className="text-xs sm:text-sm text-[#9c9587] leading-relaxed">
              We provide seamless end-to-end guidance from confidential shortlisting and private chauffeur inspections to legal deed registration, mutation, and post-purchase asset management.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#171922] via-[#12141a] to-[#171922] border border-[#c5a880]/30 text-center space-y-6">
          <h3 className="font-serif text-3xl text-white">
            Meet the Partners Leading Our Practice
          </h3>
          <p className="text-sm text-[#a8a195] max-w-xl mx-auto">
            Discover the individual leadership, experience, and advisory philosophies of our founding directors.
          </p>
          <button
            onClick={() => onNavigate('owners')}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-full transition-all cursor-pointer shadow-lg"
          >
            <span>Meet Our Owners</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
