import React, { useState, useEffect } from 'react';
import {
  Download,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Enquiry } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminEnquiries: React.FC = () => {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for Viewing Detail
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEnquiries(await res.json());
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [token]);

  const handleUpdateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this client enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/enquiries/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shri_goyal_enquiries_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const filtered = enquiries.filter((e) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        e.fullName.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.propertyTitle && e.propertyTitle.toLowerCase().includes(q)) ||
        e.message.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && e.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Contact &amp; Enquiry Management
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Track leads, follow up on WhatsApp, call prospective buyers, and export records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Enquiries to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12141c] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8c8577] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search inquiries by client, phone, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#191c24] rounded-xl border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'contacted', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st ? 'bg-[#dfc499] text-black font-semibold' : 'text-[#8c8577] hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-[#12141c] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#ded8cd]">
            <thead className="bg-[#191c26] text-[#8c8577] uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Enquiry Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((enq) => {
                const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${enq.fullName}, this is Shri Goyal Associates reaching out regarding your property enquiry.`
                )}`;

                return (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-[#8c8577] whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {enq.fullName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-[#dfc499]">{enq.phone}</div>
                        <div className="text-[11px] text-[#8c8577]">{enq.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="max-w-xs">
                        <span className="font-medium text-white">{enq.enquiryType}</span>
                        {enq.propertyTitle && (
                          <div className="text-[11px] text-[#dfc499] truncate">
                            Property: {enq.propertyTitle}
                          </div>
                        )}
                        <p className="text-[11px] text-[#8c8577] truncate mt-0.5">
                          {enq.message}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border-0 cursor-pointer focus:outline-none ${
                          enq.status === 'new'
                            ? 'bg-emerald-950 text-emerald-300'
                            : enq.status === 'contacted'
                            ? 'bg-sky-950 text-sky-300'
                            : enq.status === 'in_progress'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        <option value="new" className="bg-[#191c24] text-white">New</option>
                        <option value="contacted" className="bg-[#191c24] text-white">Contacted</option>
                        <option value="in_progress" className="bg-[#191c24] text-white">In Progress</option>
                        <option value="resolved" className="bg-[#191c24] text-white">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                          className="p-1.5 rounded-lg text-[#ded8cd] hover:text-[#dfc499] hover:bg-white/10"
                          title="Call Client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[#ded8cd] hover:text-[#25D366] hover:bg-white/10"
                          title="WhatsApp Follow-up"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${enq.email}`}
                          className="p-1.5 rounded-lg text-[#ded8cd] hover:text-white hover:bg-white/10"
                          title="Email Client"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1.5 rounded-lg text-[#ded8cd] hover:text-white hover:bg-white/10"
                          title="View Message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="p-1.5 rounded-lg text-[#ded8cd] hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#12141c] border border-white/10 rounded-3xl p-6 sm:p-8 text-[#ded8cd] space-y-5">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-[#8c8577] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#dfc499] font-medium">
                Client Enquiry Details
              </span>
              <h3 className="font-serif text-2xl text-white font-medium mt-1">
                {selectedEnquiry.fullName}
              </h3>
              <p className="text-xs text-[#8c8577]">
                Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#191c24] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8c8577]">Phone:</span>
                <span className="text-white font-medium">{selectedEnquiry.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8577]">Email:</span>
                <span className="text-white font-medium">{selectedEnquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8577]">Type:</span>
                <span className="text-[#dfc499] font-medium">{selectedEnquiry.enquiryType}</span>
              </div>
              {selectedEnquiry.propertyTitle && (
                <div className="flex justify-between">
                  <span className="text-[#8c8577]">Property:</span>
                  <span className="text-white font-medium">{selectedEnquiry.propertyTitle}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8c8577] mb-1">
                Client Inquiry Message:
              </label>
              <div className="p-4 rounded-xl bg-[#191c24] text-xs text-white leading-relaxed whitespace-pre-line border border-white/5">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedEnquiry.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2 text-xs font-semibold text-black bg-[#dfc499] rounded-xl flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#25D366] rounded-xl flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs bg-white/10 hover:bg-white/15 rounded-xl text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
