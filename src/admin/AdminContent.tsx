import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Star, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Testimonial, Service } from '../types';

export const AdminContent: React.FC = () => {
  const { settings, refreshSettings, updateSettingsState } = useSettings();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'why' | 'testimonials' | 'services'>('hero');

  // Form State initialized from settings
  const [formData, setFormData] = useState({
    heroHeadline: settings.heroHeadline,
    heroSubtitle: settings.heroSubtitle,
    heroBgImage: settings.heroBgImage,
    heroCta1Text: settings.heroCta1Text,
    heroCta1Link: settings.heroCta1Link,
    heroCta2Text: settings.heroCta2Text,
    heroCta2Link: settings.heroCta2Link,
    heroStat1Number: settings.heroStat1Number,
    heroStat1Label: settings.heroStat1Label,
    heroStat2Number: settings.heroStat2Number,
    heroStat2Label: settings.heroStat2Label,
    heroStat3Number: settings.heroStat3Number,
    heroStat3Label: settings.heroStat3Label,
    aboutHeading: settings.aboutHeading,
    aboutSubtitle: settings.aboutSubtitle,
    aboutText: settings.aboutText,
    aboutImage: settings.aboutImage,
    whyChooseHeading: settings.whyChooseHeading,
    whyChooseSubtitle: settings.whyChooseSubtitle
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Testimonial modal
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: '',
    designation: '',
    propertyOrLocation: '',
    rating: 5,
    comment: '',
    published: true
  });

  useEffect(() => {
    setFormData({
      heroHeadline: settings.heroHeadline,
      heroSubtitle: settings.heroSubtitle,
      heroBgImage: settings.heroBgImage,
      heroCta1Text: settings.heroCta1Text,
      heroCta1Link: settings.heroCta1Link,
      heroCta2Text: settings.heroCta2Text,
      heroCta2Link: settings.heroCta2Link,
      heroStat1Number: settings.heroStat1Number,
      heroStat1Label: settings.heroStat1Label,
      heroStat2Number: settings.heroStat2Number,
      heroStat2Label: settings.heroStat2Label,
      heroStat3Number: settings.heroStat3Number,
      heroStat3Label: settings.heroStat3Label,
      aboutHeading: settings.aboutHeading,
      aboutSubtitle: settings.aboutSubtitle,
      aboutText: settings.aboutText,
      aboutImage: settings.aboutImage,
      whyChooseHeading: settings.whyChooseHeading,
      whyChooseSubtitle: settings.whyChooseSubtitle
    });
  }, [settings]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [testRes, servRes] = await Promise.all([
          fetch('/api/admin/testimonials', { headers }),
          fetch('/api/admin/services', { headers })
        ]);
        if (testRes.ok) setTestimonials(await testRes.json());
        if (servRes.ok) setServices(await servRes.json());
      } catch (err) {
        console.error('Error fetching admin content:', err);
      }
    }
    fetchContent();
  }, [token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

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
      if (!res.ok) throw new Error(data.error || 'Failed to update content.');

      updateSettingsState(data.settings);
      setFeedback({ type: 'success', text: 'Website content updated and published live.' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error updating content.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTestimonial = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !t.published })
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, published: !item.published } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling testimonial:', err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTestimonial)
      });
      if (res.ok) {
        const item = await res.json();
        setTestimonials((prev) => [item, ...prev]);
        setIsTestimonialModalOpen(false);
        setNewTestimonial({
          clientName: '',
          designation: '',
          propertyOrLocation: '',
          rating: 5,
          comment: '',
          published: true
        });
      }
    } catch (err) {
      console.error('Failed to create testimonial:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
          Website Content Manager
        </h1>
        <p className="text-xs text-[#a8a195] mt-1">
          Edit headlines, about copy, proof metrics, hero media, and client reviews across the website.
        </p>
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
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'hero' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          Hero Section &amp; Metrics
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'about' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          About Section
        </button>
        <button
          onClick={() => setActiveTab('why')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'why' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          Why Choose Us
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'testimonials' ? 'bg-[#dfc499] text-black' : 'text-[#ded8cd] hover:bg-white/5'
          }`}
        >
          Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveSettings} className="bg-[#12141c] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white font-medium">Hero Text &amp; Banner Media</h2>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Hero Subtitle / Value Proposition
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Hero Background Image URL
              </label>
              <input
                type="text"
                value={formData.heroBgImage}
                onChange={(e) => setFormData({ ...formData, heroBgImage: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={formData.heroCta1Text}
                  onChange={(e) => setFormData({ ...formData, heroCta1Text: e.target.value })}
                  className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={formData.heroCta2Text}
                  onChange={(e) => setFormData({ ...formData, heroCta2Text: e.target.value })}
                  className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="font-serif text-lg text-white">Homepage Proof Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] text-[#8c8577]">Stat 1 Number</label>
                  <input
                    type="text"
                    value={formData.heroStat1Number}
                    onChange={(e) => setFormData({ ...formData, heroStat1Number: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.heroStat1Label}
                    onChange={(e) => setFormData({ ...formData, heroStat1Label: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#191c24] rounded-xl border border-white/10 text-[11px] text-[#a8a195] mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-[#8c8577]">Stat 2 Number</label>
                  <input
                    type="text"
                    value={formData.heroStat2Number}
                    onChange={(e) => setFormData({ ...formData, heroStat2Number: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.heroStat2Label}
                    onChange={(e) => setFormData({ ...formData, heroStat2Label: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#191c24] rounded-xl border border-white/10 text-[11px] text-[#a8a195] mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-[#8c8577]">Stat 3 Number</label>
                  <input
                    type="text"
                    value={formData.heroStat3Number}
                    onChange={(e) => setFormData({ ...formData, heroStat3Number: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.heroStat3Label}
                    onChange={(e) => setFormData({ ...formData, heroStat3Label: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#191c24] rounded-xl border border-white/10 text-[11px] text-[#a8a195] mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Hero Content'}</span>
            </button>
          </div>
        </form>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveSettings} className="bg-[#12141c] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white font-medium">About Section Copy &amp; Imagery</h2>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                About Section Heading
              </label>
              <input
                type="text"
                value={formData.aboutHeading}
                onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                About Section Subtitle
              </label>
              <input
                type="text"
                value={formData.aboutSubtitle}
                onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Detailed About Prose
              </label>
              <textarea
                rows={5}
                value={formData.aboutText}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                About Architecture Image URL
              </label>
              <input
                type="text"
                value={formData.aboutImage}
                onChange={(e) => setFormData({ ...formData, aboutImage: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save About Section'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Why Choose Us Tab */}
      {activeTab === 'why' && (
        <form onSubmit={handleSaveSettings} className="bg-[#12141c] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-white font-medium">Why Discerning Clients Choose Us</h2>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={formData.whyChooseHeading}
                onChange={(e) => setFormData({ ...formData, whyChooseHeading: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={formData.whyChooseSubtitle}
                onChange={(e) => setFormData({ ...formData, whyChooseSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#a8a195]">
              Approve, hide, or add client reviews. Uncheck visible to keep reviews in draft.
            </p>
            <button
              onClick={() => setIsTestimonialModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-[#12141c] border border-white/5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <button
                      onClick={() => handleToggleTestimonial(t)}
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        t.published ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {t.published ? 'Visible on Site' : 'Hidden'}
                    </button>
                  </div>
                  <p className="text-xs text-[#ded8cd] italic leading-relaxed mb-3">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                  <div>
                    <h4 className="font-serif text-sm text-white font-medium">{t.clientName}</h4>
                    <p className="text-[11px] text-[#8c8577]">{t.designation} · {t.propertyOrLocation}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Testimonial Modal */}
          {isTestimonialModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-[#12141c] border border-white/10 rounded-2xl p-6 text-[#ded8cd] space-y-4">
                <button
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="absolute top-4 right-4 text-[#8c8577] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-serif text-xl text-white">Add Client Review</h3>
                <form onSubmit={handleCreateTestimonial} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={newTestimonial.clientName}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={newTestimonial.designation}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Property or Location</label>
                    <input
                      type="text"
                      value={newTestimonial.propertyOrLocation}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, propertyOrLocation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Testimonial Comment</label>
                    <textarea
                      rows={3}
                      required
                      value={newTestimonial.comment}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                      className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={newTestimonial.published}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, published: e.target.checked })}
                      className="accent-[#dfc499]"
                    />
                    <span>Publish live immediately</span>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTestimonialModalOpen(false)}
                      className="px-4 py-2 text-xs bg-white/5 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-black bg-[#dfc499] rounded-xl"
                    >
                      Save Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
