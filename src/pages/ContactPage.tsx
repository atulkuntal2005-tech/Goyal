import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { apiFetch } from '../services/apiBridge';

export const ContactPage: React.FC = () => {
  const { settings, phoneUrl, emailUrl, whatsappUrl, formattedAddress } = useSettings();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('General Inquiry');
  const [propertyInterest, setPropertyInterest] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
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
          propertyTitle: propertyInterest.trim() || undefined,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setIsSuccess(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setPropertyInterest('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while submitting your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-[#ede8df] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
            Contact &amp; Location
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#fbf7ee] font-normal tracking-tight">
            Connect with Shri Goyal Associates
          </h1>
          <p className="text-base text-[#a8a195] font-light leading-relaxed">
            Our leadership team is available for private appointments, property evaluations, and confidential site inspections.
          </p>
        </div>

        {/* Quick Action Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Direct Call */}
          <a
            href={phoneUrl}
            className="p-6 rounded-2xl bg-[#12141a] border border-[#c5a880]/20 hover:border-[#dfc499] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center group-hover:bg-[#dfc499] group-hover:text-black transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium">Call Directly</h3>
              <p className="text-xs text-[#a8a195]">Speak with our senior desk</p>
            </div>
            <div className="pt-4 text-xs font-semibold text-[#dfc499]">
              {settings.phone}
            </div>
          </a>

          {/* WhatsApp Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#12141a] border border-[#25D366]/20 hover:border-[#25D366] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium">WhatsApp Us</h3>
              <p className="text-xs text-[#a8a195]">Instant mobile messaging</p>
            </div>
            <div className="pt-4 text-xs font-semibold text-[#25D366]">
              {settings.whatsapp}
            </div>
          </a>

          {/* Official Email */}
          <a
            href={emailUrl}
            className="p-6 rounded-2xl bg-[#12141a] border border-[#c5a880]/20 hover:border-[#dfc499] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center group-hover:bg-[#dfc499] group-hover:text-black transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium">Email Advisory</h3>
              <p className="text-xs text-[#a8a195]">Send legal &amp; plot briefs</p>
            </div>
            <div className="pt-4 text-xs font-semibold text-[#dfc499] break-all">
              {settings.email}
            </div>
          </a>

          {/* Get Directions */}
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#12141a] border border-[#c5a880]/20 hover:border-[#dfc499] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center group-hover:bg-[#dfc499] group-hover:text-black transition-colors">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium">Get Directions</h3>
              <p className="text-xs text-[#a8a195]">Mandi Choraha, Mathura</p>
            </div>
            <div className="pt-4 text-xs font-semibold text-[#dfc499] flex items-center gap-1">
              <span>Open Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>

        {/* Two-Column Grid: Form & Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#12141c] p-8 sm:p-10 rounded-3xl border border-[#c5a880]/30 shadow-2xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#fbf7ee] mb-2">
              Send an Official Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a195] mb-6">
              Complete the form below to receive detailed documentation, pricing insights, or to request a private property meeting.
            </p>

            {isSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-emerald-200">
                  <p className="font-semibold text-white">Enquiry Submitted Successfully</p>
                  <p>Your message has been stored in our advisory records. Our directors will get back to you shortly.</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-start gap-3 text-xs text-rose-200">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
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
                  placeholder="e.g. Anand Goyal"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
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
                    placeholder="+91 90123 45678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Enquiry Type
                  </label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Residential Property">Residential Property Purchase</option>
                    <option value="Commercial Space">Commercial / Retail Plot</option>
                    <option value="Land / Plot Consultation">Land &amp; Plot Advisory</option>
                    <option value="Book Site Inspection">Book Private Site Inspection</option>
                    <option value="List Property for Sale">List / Sell Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Property of Interest (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sovereign Villa or Mandi Choraha Plot"
                    value={propertyInterest}
                    onChange={(e) => setPropertyInterest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Your Message &amp; Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details regarding your preferred location, budget range, and timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191c26] border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Confidential Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Office Address Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#12141a] border border-white/5 space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#dfc499] font-medium">
                  Headquarters &amp; Office
                </span>
                <h3 className="font-serif text-2xl text-white">
                  {settings.businessName}
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#ded8cd]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#dfc499] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-white">{settings.addressLine1}</p>
                    <p>{settings.addressLine2}</p>
                    <p>{settings.city}, {settings.state} – {settings.pincode}</p>
                    <p>{settings.country}</p>
                    {settings.officeLandmark && (
                      <p className="text-xs text-[#dfc499] pt-1">
                        Landmark: {settings.officeLandmark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <Clock className="w-5 h-5 text-[#dfc499] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Advisory Hours</span>
                    <p className="text-[#a8a195] text-xs leading-relaxed">{settings.businessHours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-all shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Embedded Live Map */}
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/3] bg-[#161821] shadow-2xl relative">
              <iframe
                title="Office Location Map Embed"
                src={settings.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
