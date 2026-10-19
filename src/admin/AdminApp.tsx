import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProperties } from './AdminProperties';
import { AdminOwners } from './AdminOwners';
import { AdminContent } from './AdminContent';
import { AdminMedia } from './AdminMedia';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminSettings } from './AdminSettings';

interface AdminAppProps {
  onBackToWebsite: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onBackToWebsite }) => {
  const { adminUser, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [openPropertyModal, setOpenPropertyModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090c] text-[#ded8cd] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#dfc499] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onBackToSite={onBackToWebsite} />;
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        setOpenPropertyModal(false);
      }}
      onBackToWebsite={onBackToWebsite}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboard
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenAddProperty={() => {
            setCurrentTab('properties');
            setOpenPropertyModal(true);
          }}
        />
      )}

      {currentTab === 'properties' && (
        <AdminProperties initialOpenModal={openPropertyModal} />
      )}

      {currentTab === 'owners' && <AdminOwners />}

      {currentTab === 'content' && <AdminContent />}

      {currentTab === 'media' && <AdminMedia />}

      {currentTab === 'enquiries' && <AdminEnquiries />}

      {currentTab === 'settings' && <AdminSettings initialSubTab="contact" />}
    </AdminLayout>
  );
};
