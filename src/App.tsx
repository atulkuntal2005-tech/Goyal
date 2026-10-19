import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OwnersPage } from './pages/OwnersPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminApp } from './admin/AdminApp';

function AppContent() {
  const { settings } = useSettings();

  // Route state
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('admin')) return 'admin';
    if (path.startsWith('property/')) return 'property-detail';
    if (['about', 'properties', 'owners', 'services', 'contact', 'privacy', 'terms'].includes(path)) {
      return path;
    }
    return 'home';
  });

  const [routeParam, setRouteParam] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('property/')) {
      return path.replace('property/', '');
    }
    return '';
  });

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path.startsWith('admin')) {
        setCurrentPage('admin');
      } else if (path.startsWith('property/')) {
        setCurrentPage('property-detail');
        setRouteParam(path.replace('property/', ''));
      } else if (['about', 'properties', 'owners', 'services', 'contact', 'privacy', 'terms'].includes(path)) {
        setCurrentPage(path);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setRouteParam(param || '');

    let newUrl = '/';
    if (page === 'admin') newUrl = '/admin';
    else if (page === 'property-detail') newUrl = `/property/${param || ''}`;
    else if (page !== 'home') newUrl = `/${page}${param ? `?${param}` : ''}`;

    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin mode, show full admin app
  if (currentPage === 'admin') {
    return <AdminApp onBackToWebsite={() => handleNavigate('home')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0d11] text-[#ede8df] selection:bg-[#dfc499] selection:text-black">
      {/* Maintenance Mode Notice for Public Viewers if enabled */}
      {settings.maintenanceMode && (
        <div className="bg-amber-600/90 text-black text-center text-xs py-2 px-4 font-semibold tracking-wide z-50">
          Notice: Website is currently in scheduled maintenance mode. Public content updates are active.
        </div>
      )}

      {/* Primary Top Bar Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Views */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentPage === 'properties' && (
          <PropertiesPage onNavigate={handleNavigate} initialParams={routeParam} />
        )}

        {currentPage === 'property-detail' && (
          <PropertyDetailPage propertyId={routeParam} onNavigate={handleNavigate} />
        )}

        {currentPage === 'owners' && <OwnersPage onNavigate={handleNavigate} />}

        {currentPage === 'services' && <ServicesPage onNavigate={handleNavigate} />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'privacy' && <LegalPage type="privacy" />}

        {currentPage === 'terms' && <LegalPage type="terms" />}
      </main>

      {/* Comprehensive Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
