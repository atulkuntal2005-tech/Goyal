import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, Check, AlertCircle, X, Award, Phone, Mail } from 'lucide-react';
import { Owner } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminOwners: React.FC = () => {
  const { token } = useAuth();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    bio: '',
    experience: '',
    areasOfExpertise: [] as string[],
    phone: '',
    email: '',
    photoUrl: '/src/assets/images/owner_portrait_one_1792413400191.jpg',
    linkedin: '',
    twitter: '',
    orderIndex: 1,
    published: true
  });

  const [expertiseInput, setExpertiseInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/owners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOwners(await res.json());
      }
    } catch (err) {
      console.error('Error fetching admin owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [token]);

  const openCreateModal = () => {
    setEditingOwner(null);
    setFormData({
      name: '',
      designation: '',
      bio: '',
      experience: '10+ Years Industry Experience',
      areasOfExpertise: ['Commercial Advisory', 'Title Verification'],
      phone: '+91 9012792020',
      email: 'jgoyal@gmail.com',
      photoUrl: '/src/assets/images/owner_portrait_one_1792413400191.jpg',
      linkedin: 'https://linkedin.com',
      twitter: '',
      orderIndex: owners.length + 1,
      published: true
    });
    setIsModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      designation: owner.designation,
      bio: owner.bio,
      experience: owner.experience,
      areasOfExpertise: [...owner.areasOfExpertise],
      phone: owner.phone,
      email: owner.email,
      photoUrl: owner.photoUrl,
      linkedin: owner.linkedin || '',
      twitter: owner.twitter || '',
      orderIndex: owner.orderIndex,
      published: owner.published
    });
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleTogglePublish = async (owner: Owner) => {
    try {
      const res = await fetch(`/api/owners/${owner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !owner.published })
      });
      if (res.ok) {
        setOwners((prev) =>
          prev.map((o) => (o.id === owner.id ? { ...o, published: !o.published } : o))
        );
      }
    } catch (err) {
      console.error('Failed to toggle owner status:', err);
    }
  };

  const handleDelete = async (owner: Owner) => {
    if (!window.confirm(`Delete profile for "${owner.name}"?`)) return;

    try {
      const res = await fetch(`/api/owners/${owner.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOwners((prev) => prev.filter((o) => o.id !== owner.id));
      }
    } catch (err) {
      console.error('Failed to delete owner:', err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('category', 'owner');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (res.ok) {
        const item = await res.json();
        setFormData((prev) => ({ ...prev, photoUrl: item.url }));
      }
    } catch (err) {
      console.error('Error uploading owner photo:', err);
    }
  };

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !formData.areasOfExpertise.includes(expertiseInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        areasOfExpertise: [...prev.areasOfExpertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((t) => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const url = editingOwner ? `/api/owners/${editingOwner.id}` : '/api/owners';
      const method = editingOwner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error || 'Failed to save owner profile.');

      if (editingOwner) {
        setOwners((prev) => prev.map((o) => (o.id === editingOwner.id ? saved : o)));
      } else {
        setOwners((prev) => [...prev, saved]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback(err.message || 'Error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Owner &amp; Leadership Management
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Manage the two managing owner profiles, replace photographs, edit designations, and update contact details.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Owner Profile</span>
        </button>
      </div>

      {/* Owners Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {owners.map((owner) => (
          <div
            key={owner.id}
            className="bg-[#12141c] rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border border-[#dfc499]/30 bg-[#191c26] shrink-0">
                    <img
                      src={owner.photoUrl}
                      alt={owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#dfc499] font-medium">
                      Order #{owner.orderIndex} · {owner.designation}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-medium">
                      {owner.name}
                    </h3>
                    <div className="text-xs text-[#a8a195] flex items-center gap-1 mt-1">
                      <Award className="w-3.5 h-3.5 text-[#dfc499]" />
                      <span>{owner.experience}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePublish(owner)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                    owner.published
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {owner.published ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <p className="text-xs text-[#ded8cd] leading-relaxed line-clamp-3 mb-4">
                {owner.bio}
              </p>

              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-[#8c8577]">
                  Expertise Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {owner.areasOfExpertise.map((exp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#ded8cd]"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#a8a195] space-y-1 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>{owner.phone || 'Inherits Central Phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#dfc499]" />
                  <span>{owner.email || 'Inherits Central Email'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(owner)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#dfc499]" />
                <span>Edit Profile</span>
              </button>

              {owners.length > 2 && (
                <button
                  onClick={() => handleDelete(owner)}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Owner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#12141c] border border-[#c5a880]/30 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-[#ded8cd]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#8c8577] hover:text-white rounded-full bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-medium text-white mb-1">
              {editingOwner ? `Edit Profile: ${editingOwner.name}` : 'Create Owner Profile'}
            </h2>
            <p className="text-xs text-[#8c8577] mb-6">
              Update photograph, credentials, biography, and direct client contact information.
            </p>

            {feedback && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-200">
                {feedback}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {/* Photo Preview & Upload */}
              <div className="p-4 rounded-2xl bg-[#191c24] border border-white/5 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-28 rounded-xl overflow-hidden border border-[#dfc499]/40 bg-black/40 shrink-0">
                  <img src={formData.photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <label className="block text-xs font-medium text-white">
                    Owner Photograph
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-4 py-2 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Portrait</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste photo URL..."
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shri J. Goyal"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Designation <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Founder &amp; Managing Director"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Experience Claim
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 24+ Years Real Estate Stewardship"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Professional Biography
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe career achievements, leadership in Mathura/NCR real estate..."
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Areas of Expertise */}
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Areas of Expertise
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Add area (e.g. High-Value Land, Commercial Leasing)..."
                    className="flex-1 px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExpertise();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddExpertise}
                    className="px-4 py-2 text-xs bg-white/10 text-white rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.areasOfExpertise.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(tag)}
                        className="text-[#8c8577] hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-[#ded8cd]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-[#dfc499] rounded"
                  />
                  <span>Visible on Public Website</span>
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs text-[#ded8cd] bg-white/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
