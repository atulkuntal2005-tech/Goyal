import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettingsState: (newSettings: SiteSettings) => void;
  phoneUrl: string;
  emailUrl: string;
  whatsappUrl: string;
  getWhatsAppPropertyUrl: (propertyTitle: string) => string;
  formattedAddress: string;
}

const defaultSettings: SiteSettings = {
  id: 'default_settings',
  businessName: 'Shri Goyal Associates',
  tagline: 'Trusted Guidance. Exceptional Properties. Lasting Relationships.',
  phone: '+91 9012792020',
  whatsapp: '+91 9012792020',
  email: 'jgoyal@gmail.com',
  addressLine1: 'Mandi Choraha',
  addressLine2: 'Near Narsi Vihar',
  city: 'Mathura',
  state: 'Uttar Pradesh',
  pincode: '281004',
  country: 'India',
  officeLandmark: 'Near Narsi Vihar, Mandi Choraha, Mathura',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mandi+Choraha+Near+Narsi+Vihar+Mathura+Uttar+Pradesh+281004',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Mandi%20Choraha%2C%20Near%20Narsi%20Vihar%2C%20Mathura%2C%20Uttar%20Pradesh%20281004&t=&z=15&ie=UTF8&iwloc=&output=embed',
  businessHours: 'Monday – Saturday: 9:30 AM – 7:30 PM, Sunday: By Appointment',
  heroHeadline: 'Find Your Dream Property with Shri Goyal Associates',
  heroSubtitle: 'Trusted Guidance. Exceptional Properties. Lasting Relationships.',
  heroBgImage: '/src/assets/images/hero_luxury_villa_1792413398505.jpg',
  heroCta1Text: 'Explore Properties',
  heroCta1Link: '/properties',
  heroCta2Text: 'Contact Us',
  heroCta2Link: '/contact',
  heroStat1Number: '₹450 Cr+',
  heroStat1Label: 'Portfolio Value Transacted',
  heroStat2Number: '24+ Years',
  heroStat2Label: 'Unbroken Legacy of Trust',
  heroStat3Number: '1,200+',
  heroStat3Label: 'Premium Properties & Plots Advised',
  aboutHeading: 'Leading Luxury & Commercial Real Estate Advisory in Mathura & NCR',
  aboutSubtitle: 'Built on transparency, local authority, and generational client trust.',
  aboutText: 'Founded on absolute transparency and unmatched regional insight, Shri Goyal Associates is Mathura and NCR’s premier real estate consultancy. For over two decades, our advisory firm has guided distinguished families, business entrepreneurs, and institutional investors through high-value residential acquisitions, commercial land developments, and legally verified plot transactions.',
  aboutExperienceYears: '24+',
  aboutImage: '/src/assets/images/about_architecture_craft_1792413399389.jpg',
  whyChooseHeading: 'Why Discerning Clients Choose Shri Goyal Associates',
  whyChooseSubtitle: 'A legacy of meticulous diligence, verified titles, and white-glove advisory.',
  contactHeading: 'Let\'s Find the Right Property for You',
  contactDescription: 'Reach out to our leadership team for confidential consultations, personalized property shortlists, or to schedule a private site inspection.',
  currency: 'INR',
  maintenanceMode: false,
  primaryColor: '#c5a880',
  secondaryColor: '#0c0d11',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to load site settings');
      const data = await res.json();
      setSettings(data);
      setError(null);
    } catch (err: any) {
      console.warn('Using default settings fallback:', err);
      setError(err.message || 'Error fetching settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettingsState = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const cleanPhone = (settings.phone || '+919012792020').replace(/[^0-9+]/g, '');
  const cleanWhatsAppNumber = (settings.whatsapp || '919012792020').replace(/[^0-9]/g, '');

  const phoneUrl = `tel:${cleanPhone}`;
  const emailUrl = `mailto:${settings.email || 'jgoyal@gmail.com'}`;
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}`;

  const getWhatsAppPropertyUrl = (propertyTitle: string) => {
    const text = `Hello Shri Goyal Associates, I am interested in ${propertyTitle}. Please share more details.`;
    return `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  const formattedAddress = [
    settings.addressLine1,
    settings.addressLine2,
    settings.city,
    settings.state ? `${settings.state} – ${settings.pincode}` : settings.pincode,
    settings.country
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refreshSettings: fetchSettings,
        updateSettingsState,
        phoneUrl,
        emailUrl,
        whatsappUrl,
        getWhatsAppPropertyUrl,
        formattedAddress
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
