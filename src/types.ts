export interface SiteSettings {
  id: string;
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  officeLandmark: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  businessHours: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroStat1Number: string;
  heroStat1Label: string;
  heroStat2Number: string;
  heroStat2Label: string;
  heroStat3Number: string;
  heroStat3Label: string;
  aboutHeading: string;
  aboutSubtitle: string;
  aboutText: string;
  aboutExperienceYears: string;
  aboutImage: string;
  whyChooseHeading: string;
  whyChooseSubtitle: string;
  contactHeading: string;
  contactDescription: string;
  currency: string;
  maintenanceMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  priceDisplay: string;
  propertyType: 'Luxury Villa' | 'Apartment' | 'Commercial Space' | 'Plot / Land' | 'Penthouse' | 'Farmhouse';
  purpose: 'Sale' | 'Rent';
  location: string;
  city: string;
  state: string;
  pincode: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  images: string[];
  primaryImage: string;
  featured: boolean;
  published: boolean;
  status: 'Available' | 'Under Negotiation' | 'Sold';
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  name: string;
  designation: string;
  bio: string;
  experience: string;
  areasOfExpertise: string[];
  phone: string;
  email: string;
  photoUrl: string;
  linkedin?: string;
  twitter?: string;
  orderIndex: number;
  published: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  imageUrl?: string;
  orderIndex: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  designation: string;
  propertyOrLocation: string;
  rating: number;
  comment: string;
  published: boolean;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  enquiryType: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'resolved';
  notes?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalOwners: number;
}
