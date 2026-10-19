import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { settings, formattedAddress } = useSettings();

  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#12141c] p-8 sm:p-12 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Legal &amp; Regulatory Compliance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#fbf7ee] font-normal tracking-tight mt-1">
            {isPrivacy ? 'Privacy & Data Protection Policy' : 'Terms of Real Estate Advisory'}
          </h1>
          <p className="text-xs text-[#8c8577] mt-2">
            Last Updated: March 2026 · {settings.businessName}
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-[#ded8cd] leading-relaxed border-t border-white/5 pt-6">
          {isPrivacy ? (
            <>
              <p>
                At <strong>{settings.businessName}</strong>, we treat the confidentiality of our clients, property buyers, sellers, and investors with the highest standard of care. This Privacy Policy outlines how our consultancy collects, safeguards, and handles personal data.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">1. Information We Collect</h2>
              <p>
                When you submit an inquiry, request a property site inspection, or engage our advisory services, we collect your name, contact phone number, email address, property preferences, and budget parameters.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">2. Use of Information</h2>
              <p>
                We use collected information solely to provide personalized property consultations, arrange visits, verify title records, and comply with state and central real estate regulations (including RERA compliance). We never sell or share client data with third-party marketing firms.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">3. Data Security &amp; Confidentiality</h2>
              <p>
                All inquiries submitted through our website or direct phone/WhatsApp desk are stored in secure, access-controlled databases accessible exclusively to authorized partners of {settings.businessName}.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">4. Contacting Our Data Desk</h2>
              <p>
                For questions regarding your information, contact our compliance officer at <a href={`mailto:${settings.email}`} className="text-[#dfc499] underline">{settings.email}</a> or visit our office at {formattedAddress}.
              </p>
            </>
          ) : (
            <>
              <p>
                These Terms of Advisory govern the real estate consultation and brokerage services provided by <strong>{settings.businessName}</strong>, registered and operating in Mathura and Uttar Pradesh, India.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">1. Scope of Advisory Services</h2>
              <p>
                {settings.businessName} provides professional property representation, site visit coordination, market valuation, and legal title due diligence facilitation for residential and commercial assets.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">2. Property Representations &amp; Due Diligence</h2>
              <p>
                While all listings presented by {settings.businessName} undergo extensive pre-listing revenue and municipal scrutiny, buyers and investors are encouraged to inspect original deeds during legal registry proceedings. Our team assists with full registrar coordination and mutation processes.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">3. Brokerage &amp; Facilitation Fees</h2>
              <p>
                Professional consultation and facilitation terms are agreed upon in writing prior to deed execution in compliance with standard regional and RERA guidelines.
              </p>

              <h2 className="font-serif text-2xl text-white pt-4">4. Governing Jurisdiction</h2>
              <p>
                All agreements, inquiries, and transactions facilitated by our firm are subject to the exclusive jurisdiction of the civil courts of Mathura, Uttar Pradesh, India.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
