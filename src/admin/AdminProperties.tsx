import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  X,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';

interface AdminPropertiesProps {
  initialOpenModal?: boolean;
}

export const AdminProperties: React.FC<AdminPropertiesProps> = ({ initialOpenModal = false }) => {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal);
  const [editingProp, setEditingProp] = useState<Property | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: 15000000,
    priceDisplay: '₹1.50 Cr',
    propertyType: 'Luxury Villa' as Property['propertyType'],
    purpose: 'Sale' as Property['purpose'],
    location: '',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    pincode: '281004',
    areaSqFt: 3000,
    bedrooms: 4,
    bathrooms: 4,
    description: '',
    amenities: ['100% Power Backup', 'Clear Title Deed', '24/7 Security'],
    images: ['/src/assets/images/hero_luxury_villa_1792413398505.jpg'],
    primaryImage: '/src/assets/images/hero_luxury_villa_1792413398505.jpg',
    featured: false,
    published: true,
    status: 'Available' as Property['status']
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error('Error fetching admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [token]);

  const openCreateModal = () => {
    setEditingProp(null);
    setFormData({
      title: '',
      price: 25000000,
      priceDisplay: '₹2.50 Cr',
      propertyType: 'Luxury Villa',
      purpose: 'Sale',
      location: 'Near Narsi Vihar, Mathura',
      city: 'Mathura',
      state: 'Uttar Pradesh',
      pincode: '281004',
      areaSqFt: 3500,
      bedrooms: 4,
      bathrooms: 4,
      description: 'Prestigious luxury villa located in an exclusive enclave in Mathura. Complete clear title documentation and immediate registry facilitation.',
      amenities: ['100% Power Backup', 'Clear Title Deed', '24/7 Gated Security', 'Vastu Compliant', 'Italian Marble Flooring'],
      images: ['/src/assets/images/hero_luxury_villa_1792413398505.jpg'],
      primaryImage: '/src/assets/images/hero_luxury_villa_1792413398505.jpg',
      featured: true,
      published: true,
      status: 'Available'
    });
    setIsModalOpen(true);
    setFeedbackMsg(null);
  };

  const openEditModal = (prop: Property) => {
    setEditingProp(prop);
    setFormData({
      title: prop.title,
      price: prop.price,
      priceDisplay: prop.priceDisplay,
      propertyType: prop.propertyType,
      purpose: prop.purpose,
      location: prop.location,
      city: prop.city,
      state: prop.state,
      pincode: prop.pincode,
      areaSqFt: prop.areaSqFt,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      description: prop.description,
      amenities: [...prop.amenities],
      images: [...prop.images],
      primaryImage: prop.primaryImage,
      featured: prop.featured,
      published: prop.published,
      status: prop.status
    });
    setIsModalOpen(true);
    setFeedbackMsg(null);
  };

  const handleTogglePublish = async (prop: Property) => {
    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !prop.published })
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === prop.id ? { ...p, published: !p.published } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleToggleFeature = async (prop: Property) => {
    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !prop.featured })
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === prop.id ? { ...p, featured: !p.featured } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle feature status:', err);
    }
  };

  const handleDuplicate = async (prop: Property) => {
    try {
      const res = await fetch(`/api/properties/${prop.id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const copy = await res.json();
        setProperties((prev) => [copy, ...prev]);
      }
    } catch (err) {
      console.error('Failed to duplicate property:', err);
    }
  };

  const handleDelete = async (prop: Property) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prop.title}"?`)) return;

    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== prop.id));
      }
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== name)
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => {
        const updated = [...prev.images, imageInput.trim()];
        return {
          ...prev,
          images: updated,
          primaryImage: prev.primaryImage || updated[0]
        };
      });
      setImageInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('category', 'property');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (res.ok) {
        const item = await res.json();
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, item.url],
          primaryImage: prev.primaryImage || item.url
        }));
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    setIsSubmitting(true);

    try {
      const url = editingProp ? `/api/properties/${editingProp.id}` : '/api/properties';
      const method = editingProp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error || 'Failed to save property listing.');

      if (editingProp) {
        setProperties((prev) => prev.map((p) => (p.id === editingProp.id ? saved : p)));
      } else {
        setProperties((prev) => [saved, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error saving listing.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = properties.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterType !== 'all' && p.propertyType !== filterType) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Property Management
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Add, update, feature, or archive verified properties across Mathura &amp; NCR.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Property Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12141c] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8c8577] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Luxury Villa">Luxury Villa</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Commercial Space">Commercial Space</option>
            <option value="Plot / Land">Plot / Land</option>
            <option value="Apartment">Apartment</option>
            <option value="Farmhouse">Farmhouse</option>
          </select>

          <span className="text-xs text-[#8c8577] whitespace-nowrap">
            {filtered.length} total
          </span>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-[#12141c] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#ded8cd]">
            <thead className="bg-[#191c26] text-[#8c8577] uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.primaryImage || '/src/assets/images/hero_luxury_villa_1792413398505.jpg'}
                        alt={prop.title}
                        className="w-12 h-10 rounded-lg object-cover bg-[#1c1f2b] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-xs">{prop.title}</div>
                        <div className="text-[11px] text-[#8c8577] truncate">{prop.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[11px]">
                      {prop.propertyType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#dfc499] tabular-nums">
                    {prop.priceDisplay}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        prop.status === 'Available'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(prop)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        prop.published
                          ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {prop.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{prop.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeature(prop)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        prop.featured ? 'text-amber-400 bg-amber-400/10' : 'text-[#8c8577] hover:text-white'
                      }`}
                      title={prop.featured ? 'Featured on Homepage' : 'Not Featured'}
                    >
                      <Star className={`w-4 h-4 ${prop.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(prop)}
                        className="p-1.5 rounded-lg text-[#ded8cd] hover:text-white hover:bg-white/10"
                        title="Edit Property"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prop)}
                        className="p-1.5 rounded-lg text-[#ded8cd] hover:text-[#dfc499] hover:bg-white/10"
                        title="Duplicate Listing"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop)}
                        className="p-1.5 rounded-lg text-[#ded8cd] hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#12141c] border border-[#c5a880]/30 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-[#ded8cd]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#8c8577] hover:text-white rounded-full bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-medium text-white mb-2">
              {editingProp ? 'Edit Property Listing' : 'Create New Property Listing'}
            </h2>
            <p className="text-xs text-[#8c8577] mb-6">
              Fill in all property specifications and amenities for Shri Goyal Associates clients.
            </p>

            {feedbackMsg && (
              <div
                className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-xs ${
                  feedbackMsg.type === 'error'
                    ? 'bg-rose-950/60 border border-rose-500/30 text-rose-200'
                    : 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-200'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Property Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Heritage Villa &amp; Private Estate"
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Price (Numeric in INR) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        price: val,
                        priceDisplay: val >= 10000000 ? `₹${(val / 10000000).toFixed(2)} Cr` : `₹${(val / 100000).toFixed(2)} Lakhs`
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Display Price Label
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="e.g. ₹3.85 Cr or ₹65,000 / mo"
                    className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial Space">Commercial Space</option>
                    <option value="Plot / Land">Plot / Land</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Farmhouse">Farmhouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Purpose
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Sale">Sale (Outright)</option>
                    <option value="Rent">Rent / Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Availability Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Negotiation">Under Negotiation</option>
                    <option value="Sold">Sold / Leased</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={formData.areaSqFt}
                    onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Location / Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Near Narsi Vihar, Mathura"
                  className="w-full px-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Features &amp; Amenities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Add amenity (e.g. Swimming Pool, Gated Security)..."
                    className="flex-1 px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2 text-xs bg-white/10 text-white hover:bg-white/20 rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <span>{a}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(a)}
                        className="text-[#8c8577] hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Gallery */}
              <div>
                <label className="block text-xs font-medium text-[#ded8cd] mb-1">
                  Image Gallery
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Add image URL..."
                    className="flex-1 px-3 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 text-xs bg-white/10 text-white hover:bg-white/20 rounded-xl"
                  >
                    Add URL
                  </button>
                  <label className="px-3 py-2 text-xs bg-[#dfc499]/20 text-[#dfc499] hover:bg-[#dfc499]/30 rounded-xl cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Device Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 group ${
                        formData.primaryImage === img ? 'border-[#dfc499]' : 'border-white/10'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, primaryImage: img })}
                          className="p-1 rounded bg-[#dfc499] text-black text-[10px] font-semibold"
                          title="Set as Primary"
                        >
                          Primary
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== i)
                            }))
                          }
                          className="p-1 rounded bg-rose-600 text-white"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {formData.primaryImage === img && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] bg-black/80 text-[#dfc499] font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap gap-6 text-xs text-[#ded8cd]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-[#dfc499] rounded"
                  />
                  <span>Published (Visible publicly)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#dfc499] rounded"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs text-[#ded8cd] bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingProp ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
