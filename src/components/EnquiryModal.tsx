import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Send, Phone, MessageCircle } from 'lucide-react';
import { Property } from '../types';
import { useSettings } from '../context/SettingsContext';
import { apiFetch } from '../services/apiBridge';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  defaultEnquiryType?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  defaultEnquiryType = 'General Inquiry'
}) => {
  const { settings, phoneUrl, getWhatsAppPropertyUrl, whatsappUrl } = useSettings();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState(property ? 'Property Purchase' : defaultEnquiryType);
  const [message, setMessage] = useState(
    property
      ? `Hello Shri Goyal Associates, I am interested in ${property.title} (${property.location}). Please provide complete documentation and schedule a site visit.`
      : 'Hello, I would like to inquire about your property advisory services in Mathura & NCR.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          enquiryType,
          propertyId: property?.id,
          propertyTitle: property?.title,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  const propertyWhatsAppUrl = property ? getWhatsAppPropertyUrl(property.title) : whatsappUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#111319] border border-[#c5a880]/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#f4efe6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-[#a8a195] hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl text-[#fbf7ee]">
              Enquiry Received
            </h3>

            <p className="text-sm text-[#b5ae9f] max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-white">{fullName}</span>. Your enquiry has been securely logged in our client advisory system. Our leadership team will review your requirements and reach out to you within a few business hours.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={propertyWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20b858] rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Follow-up</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-[#ded8cd] bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-widest text-[#dfc499] font-medium">
                Confidential Consultation
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#fbf7ee] mt-1">
                {property ? `Enquire About ${property.title}` : 'Submit an Enquiry'}
              </h3>
              <p className="text-xs text-[#a8a195] mt-1">
                Direct advisory connection with Shri Goyal Associates.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Enquiry Type
                </label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors"
                >
                  <option value="Property Purchase">Property Purchase / Acquisition</option>
                  <option value="Commercial Space">Commercial / Retail Space</option>
                  <option value="Land / Plot Consultation">Land &amp; Plot Advisory</option>
                  <option value="Site Visit Booking">Book Private Site Visit</option>
                  <option value="Property Rental">Luxury Rental / Lease</option>
                  <option value="Selling / Listing Property">List / Sell My Property</option>
                  <option value="General Inquiry">General Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Message / Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details on your budget, timeline, or preferred locations..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191c24] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={phoneUrl}
                  className="inline-flex items-center gap-1.5 text-xs text-[#dfc499] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {settings.phone}</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
