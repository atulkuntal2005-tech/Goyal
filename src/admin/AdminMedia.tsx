import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MediaItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminMedia: React.FC = () => {
  const { token } = useAuth();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMediaList(await res.json());
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }

    setErrorMessage(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryFilter === 'all' ? 'general' : categoryFilter);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload media file.');

      setMediaList((prev) => [data, ...prev]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media asset?')) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaList.filter((m) => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Media Asset Library
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Upload and manage property photos, owner portraits, and architecture banners.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer shadow-md">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Image from Device'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 bg-[#12141c] p-2 rounded-xl border border-white/5 w-fit">
        {['all', 'hero', 'property', 'owner', 'general'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
              categoryFilter === cat ? 'bg-[#dfc499] text-black font-semibold' : 'text-[#8c8577] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8c8577]">Loading media assets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-[#12141c] rounded-3xl border border-white/5">
          <ImageIcon className="w-12 h-12 text-[#8c8577] mx-auto opacity-30" />
          <h3 className="font-serif text-xl text-white">No Media in this Category</h3>
          <p className="text-xs text-[#8c8577]">Upload an image from your device to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#12141c] rounded-2xl overflow-hidden border border-white/10 hover:border-[#dfc499]/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-[#1a1c24]">
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider bg-black/70 text-[#dfc499] font-medium backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-3 bg-[#161822] space-y-2">
                <p className="text-[11px] font-medium text-white truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#8c8577]">
                  <span>{(item.size / 1024).toFixed(0)} KB</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-1 rounded text-[#ded8cd] hover:text-[#dfc499] hover:bg-white/10"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded text-[#ded8cd] hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
