import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onBackToWebsite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToWebsite,
  children
}) => {
  const { adminUser, logout } = useAuth();
  const { settings } = useSettings();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'properties', label: 'Property Listings', icon: <Building2 className="w-4 h-4" /> },
    { id: 'owners', label: 'Managing Owners', icon: <Users className="w-4 h-4" /> },
    { id: 'content', label: 'Content Manager', icon: <FileText className="w-4 h-4" /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'enquiries', label: 'Enquiries & Leads', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Business Contact Info', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#08090c] text-[#ede8df] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0f14] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Lockup */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfc499] to-[#8c6d3d] flex items-center justify-center text-black font-serif font-bold text-sm shadow">
              SGA
            </div>
            <div>
              <div className="font-serif text-lg font-medium text-white truncate max-w-[140px]">
                {settings.businessName}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#dfc499] font-medium block">
                Admin CMS Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-[#dfc499] text-black font-semibold shadow-sm'
                    : 'text-[#ded8cd] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Profile and Actions */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-[#dfc499] bg-[#dfc499]/10 hover:bg-[#dfc499]/20 rounded-xl transition-colors cursor-pointer border border-[#dfc499]/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <div className="flex items-center justify-between pt-2 text-xs text-[#8c8577]">
            <div className="truncate pr-2">
              <span className="block text-white font-medium truncate">{adminUser?.name || 'Administrator'}</span>
              <span className="block text-[10px] truncate">{adminUser?.email}</span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg text-[#8c8577] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
