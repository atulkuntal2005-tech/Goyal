import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Phone, MessageCircle, Mail, MapPin, Navigation, Clock, Globe } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface AdminSettingsProps {
  initialSubTab?: 'contact' | 'global';
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ initialSubTab = 'contact' }) => {
  const { settings, updateSettingsState, refreshSettings } = useSettings();
  const { token } = useAuth();

  const [subTab, setSubTab] = useState<'contact' | 'global'>(initialSubTab);

  const [formData, setFormData] = useState({
    businessName: settings.businessName,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    addressLine1: settings.addressLine1,
    addressLine2: settings.addressLine2,
    city: settings.city,
    state: settings.state,
    pincode: settings.pincode,
    country: settings.country,
    officeLandmark: settings.officeLandmark,
    googleMapsUrl: settings.googleMapsUrl,
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
    businessHours: settings.businessHours,
    contactHeading: settings.contactHeading,
    contactDescription: settings.contactDescription,
    currency: settings.currency || 'INR',
    maintenanceMode: settings.maintenanceMode || false,
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    linkedinUrl: settings.linkedinUrl || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setFormData({
      businessName: settings.businessName,
      tagline: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      addressLine1: settings.addressLine1,
      addressLine2: settings.addressLine2,
      city: settings.city,
      state: settings.state,
      pincode: settings.pincode,
      country: settings.country,
      officeLandmark: settings.officeLandmark,
      googleMapsUrl: settings.googleMapsUrl,
      googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
      businessHours: settings.businessHours,
      contactHeading: settings.contactHeading,
      contactDescription: settings.contactDescription,
      currency: settings.currency || 'INR',
      maintenanceMode: settings.maintenanceMode || false,
      facebookUrl: settings.facebookUrl || '',
      instagramUrl: settings.instagramUrl || '',
      linkedinUrl: settings.linkedinUrl || ''
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    // Basic Validation
    if (!formData.businessName.trim() || !formData.phone.trim() || !formData.whatsapp.trim() || !formData.email.trim()) {
      setFeedback({ type: 'error', text: 'Business Name, Phone Number, WhatsApp, and Email are required.' });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update contact settings.');

      updateSettingsState(data.settings);
      setFeedback({
        type: 'success',
        text: 'Business Contact Information updated successfully. All call, WhatsApp, and email buttons across the entire website have been updated.'
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error saving settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Business Contact Information
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Centralized contact management. Any update made here immediately updates all navbar buttons, footer links, property WhatsApp enquiries, and direct phone links across the site.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs ${
            feedback.type === 'error'
              ? 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          )}
          <span className="leading-relaxed">{feedback.text}</span>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setSubTab('contact')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            subTab === 'contact' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          Contact &amp; Address Details
        </button>
        <button
          onClick={() => setSubTab('global')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            subTab === 'global' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          Brand &amp; System Preferences
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#12141c] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-8 shadow-xl">
        {subTab === 'contact' ? (
          <>
            {/* Primary Business Contact Numbers */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#dfc499]" />
                <span>Direct Communications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Phone Number (Used in Call Now) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9012792020"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                  <span className="text-[10px] text-[#8c8577] mt-1 block">
                    Powers all tel: links throughout the app.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    WhatsApp Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 9012792020"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                  <span className="text-[10px] text-[#8c8577] mt-1 block">
                    Powers all WhatsApp enquiry and chat buttons.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Official Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jgoyal@gmail.com"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                  <span className="text-[10px] text-[#8c8577] mt-1 block">
                    Powers mailto: buttons on Contact and Footer.
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Physical Address */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dfc499]" />
                <span>Office Address Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Address Line 1 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="Mandi Choraha"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    placeholder="Near Narsi Vihar"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mathura"
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    State <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Uttar Pradesh"
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    PIN Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="281004"
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Country <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="India"
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Landmark &amp; Directions Note
                </label>
                <input
                  type="text"
                  value={formData.officeLandmark}
                  onChange={(e) => setFormData({ ...formData, officeLandmark: e.target.value })}
                  placeholder="Near Narsi Vihar, Mandi Choraha, Mathura"
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white"
                />
              </div>

              {/* Google Maps Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Google Maps Destination URL (Used by "Get Directions")
                  </label>
                  <input
                    type="text"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Google Maps Embed URL (Used for embedded live map)
                  </label>
                  <input
                    type="text"
                    value={formData.googleMapsEmbedUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours & Text */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfc499]" />
                <span>Operating Hours &amp; Section Copy</span>
              </h2>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Business / Advisory Hours
                </label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  placeholder="Monday – Saturday: 9:30 AM – 7:30 PM, Sunday: By Appointment"
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Contact Section Heading
                  </label>
                  <input
                    type="text"
                    value={formData.contactHeading}
                    onChange={(e) => setFormData({ ...formData, contactHeading: e.target.value })}
                    className="w-full px-4 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Contact Section Description
                  </label>
                  <input
                    type="text"
                    value={formData.contactDescription}
                    onChange={(e) => setFormData({ ...formData, contactDescription: e.target.value })}
                    className="w-full px-4 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Global Branding Tab */
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-white font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#dfc499]" />
              <span>Brand Identity &amp; System Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Property Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ United States Dollar)</option>
                  <option value="AED">AED (Dirham)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 accent-[#dfc499] rounded"
                  />
                  <span>Website Maintenance Mode</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[11px] text-[#8c8577]">
            Changes are saved permanently to the database and update the live website immediately.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
