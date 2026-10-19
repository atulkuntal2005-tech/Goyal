import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  Users,
  MessageSquare,
  PlusCircle,
  Settings,
  ArrowUpRight,
  Phone,
  Mail,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { DashboardStats, Enquiry, Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/apiBridge';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddProperty: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onOpenAddProperty }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, enqRes, propsRes] = await Promise.all([
          apiFetch('/api/stats', { headers }),
          apiFetch('/api/enquiries', { headers }),
          apiFetch('/api/admin/properties', { headers })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (enqRes.ok) {
          const allEnq = await enqRes.json();
          setRecentEnquiries(allEnq.slice(0, 5));
        }
        if (propsRes.ok) {
          const allProps = await propsRes.json();
          setRecentProperties(allProps.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#a8a195] mt-1">
            Real-time performance metrics and enquiry management for Shri Goyal Associates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddProperty}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-colors cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Property</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#ded8cd] bg-[#191c24] hover:bg-[#222633] border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#dfc499]" />
            <span>Contact Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => onNavigateTab('properties')}
          className="p-6 rounded-2xl bg-[#12141c] border border-white/5 hover:border-[#dfc499]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-[#8c8577] mb-3">
            <span className="text-xs uppercase tracking-wider">Published Properties</span>
            <Building2 className="w-5 h-5 text-[#dfc499]" />
          </div>
          <div className="font-serif text-3xl font-bold text-white tabular-nums group-hover:text-[#dfc499] transition-colors">
            {stats?.publishedProperties ?? 0}
          </div>
          <p className="text-[11px] text-[#8c8577] mt-1">
            {stats?.draftProperties ?? 0} listings in draft state
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('enquiries')}
          className="p-6 rounded-2xl bg-[#12141c] border border-white/5 hover:border-[#dfc499]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-[#8c8577] mb-3">
            <span className="text-xs uppercase tracking-wider">New Inquiries</span>
            <MessageSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-400 tabular-nums">
            {stats?.newEnquiries ?? 0}
          </div>
          <p className="text-[11px] text-[#8c8577] mt-1">
            Total {stats?.totalEnquiries ?? 0} inquiries logged
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('owners')}
          className="p-6 rounded-2xl bg-[#12141c] border border-white/5 hover:border-[#dfc499]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-[#8c8577] mb-3">
            <span className="text-xs uppercase tracking-wider">Managing Owners</span>
            <Users className="w-5 h-5 text-[#dfc499]" />
          </div>
          <div className="font-serif text-3xl font-bold text-white tabular-nums group-hover:text-[#dfc499] transition-colors">
            {stats?.totalOwners ?? 2}
          </div>
          <p className="text-[11px] text-[#8c8577] mt-1">
            Active leadership profiles
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('content')}
          className="p-6 rounded-2xl bg-[#12141c] border border-white/5 hover:border-[#dfc499]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-[#8c8577] mb-3">
            <span className="text-xs uppercase tracking-wider">Website Content</span>
            <FileText className="w-5 h-5 text-[#dfc499]" />
          </div>
          <div className="font-serif text-2xl font-bold text-white">
            Live
          </div>
          <p className="text-[11px] text-[#8c8577] mt-1">
            Hero, Services &amp; About CMS
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-7 bg-[#12141c] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-white">
              Recent Client Enquiries
            </h2>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-semibold text-[#dfc499] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({stats?.totalEnquiries ?? 0})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-[#8c8577] py-6 text-center">No inquiries logged yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{enq.fullName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          enq.status === 'new'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-[#a8a195]'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-[#a8a195] text-[11px] mt-0.5">
                      {enq.enquiryType} {enq.propertyTitle ? `· ${enq.propertyTitle}` : ''}
                    </p>
                    <p className="text-[#8c8577] text-[10px] mt-0.5">
                      {new Date(enq.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#dfc499]/20 text-[#dfc499]"
                      title={`Call ${enq.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]"
                      title="WhatsApp Client"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`mailto:${enq.email}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                      title={`Email ${enq.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Updated Properties */}
        <div className="lg:col-span-5 bg-[#12141c] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-white">
              Properties Overview
            </h2>
            <button
              onClick={() => onNavigateTab('properties')}
              className="text-xs font-semibold text-[#dfc499] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {recentProperties.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3 text-xs">
                <img
                  src={p.primaryImage || '/images/hero_luxury_villa_1792413398505.jpg'}
                  alt={p.title}
                  onError={(e) => {
                    const fallback = '/images/hero_luxury_villa_1792413398505.jpg';
                    if (e.currentTarget.src !== window.location.origin + fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className="w-12 h-12 rounded-lg object-cover bg-[#1c1f2b] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{p.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#8c8577]">
                    <span>{p.propertyType}</span>
                    <span>·</span>
                    <span className="text-[#dfc499] font-semibold">{p.priceDisplay}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] shrink-0 ${
                    p.published ? 'text-emerald-300 bg-emerald-950/60' : 'text-amber-300 bg-amber-950/60'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
