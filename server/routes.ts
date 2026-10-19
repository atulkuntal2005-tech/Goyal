import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db.js';
import { verifyPassword, createToken, verifyToken } from './auth.js';

export const apiRouter = express.Router();

// File upload setup
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WEBP, SVG, and GIF image files are permitted.'));
    }
  }
});

// Middleware for Admin Authentication
export interface AuthenticatedRequest extends Request {
  adminUser?: {
    userId: string;
    email: string;
    role: string;
  };
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication token required.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  req.adminUser = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };
  next();
}

// ==================== AUTHENTICATION ====================
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const admin = db.findAdminByEmail(email);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = verifyPassword(password, admin.salt, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role
  });

  return res.json({
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

apiRouter.get('/auth/me', requireAdmin, (req: AuthenticatedRequest, res) => {
  const admin = db.findAdminByEmail(req.adminUser!.email);
  if (!admin) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }
  return res.json({
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

apiRouter.post('/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const admin = db.findAdminByEmail(req.adminUser!.email);
  if (!admin) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }

  const isMatch = verifyPassword(currentPassword, admin.salt, admin.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  db.updateAdminPassword(admin.email, newPassword);
  return res.json({ success: true, message: 'Password updated successfully.' });
});

// ==================== DASHBOARD STATS ====================
apiRouter.get('/stats', requireAdmin, (_req, res) => {
  return res.json(db.getStats());
});

// ==================== SETTINGS ====================
apiRouter.get('/settings', (_req, res) => {
  return res.json(db.getSettings());
});

apiRouter.put('/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    return res.json({ success: true, settings: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update settings.' });
  }
});

// ==================== PROPERTIES ====================
apiRouter.get('/properties', (req, res) => {
  const { search, type, purpose, minPrice, maxPrice, sort } = req.query;
  let list = db.getProperties(false);

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (type && typeof type === 'string' && type !== 'all') {
    list = list.filter(p => p.propertyType.toLowerCase() === type.toLowerCase());
  }

  if (purpose && typeof purpose === 'string' && purpose !== 'all') {
    list = list.filter(p => p.purpose.toLowerCase() === purpose.toLowerCase());
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    list = list.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    list = list.filter(p => p.price <= Number(maxPrice));
  }

  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Newest first by default
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return res.json(list);
});

apiRouter.get('/admin/properties', requireAdmin, (_req, res) => {
  return res.json(db.getProperties(true));
});

apiRouter.get('/properties/:id', (req, res) => {
  const prop = db.getPropertyById(req.params.id, true);
  if (!prop) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  return res.json(prop);
});

apiRouter.post('/properties', requireAdmin, (req, res) => {
  try {
    const { title, price, propertyType, purpose, location, description } = req.body;
    if (!title || price === undefined || !propertyType || !location) {
      return res.status(400).json({ error: 'Title, price, property type, and location are required.' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `property-${Date.now()}`;

    const newProp = db.createProperty({
      title,
      slug,
      price: Number(price),
      priceDisplay: req.body.priceDisplay || `₹${Number(price).toLocaleString('en-IN')}`,
      propertyType: propertyType || 'Luxury Villa',
      purpose: purpose || 'Sale',
      location: location || '',
      city: req.body.city || 'Mathura',
      state: req.body.state || 'Uttar Pradesh',
      pincode: req.body.pincode || '281004',
      areaSqFt: Number(req.body.areaSqFt) || 0,
      bedrooms: Number(req.body.bedrooms) || 0,
      bathrooms: Number(req.body.bathrooms) || 0,
      description: description || '',
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      primaryImage: req.body.primaryImage || req.body.images?.[0] || '/images/hero_luxury_villa_1792413398505.jpg',
      featured: Boolean(req.body.featured),
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
      status: req.body.status || 'Available'
    });

    return res.status(201).json(newProp);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create property.' });
  }
});

apiRouter.put('/properties/:id', requireAdmin, (req, res) => {
  const updated = db.updateProperty(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  return res.json(updated);
});

apiRouter.delete('/properties/:id', requireAdmin, (req, res) => {
  const ok = db.deleteProperty(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  return res.json({ success: true, message: 'Property deleted successfully.' });
});

apiRouter.post('/properties/:id/duplicate', requireAdmin, (req, res) => {
  const duplicated = db.duplicateProperty(req.params.id);
  if (!duplicated) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  return res.json(duplicated);
});

// ==================== OWNERS ====================
apiRouter.get('/owners', (_req, res) => {
  return res.json(db.getOwners(false));
});

apiRouter.get('/admin/owners', requireAdmin, (_req, res) => {
  return res.json(db.getOwners(true));
});

apiRouter.post('/owners', requireAdmin, (req, res) => {
  const { name, designation, bio, experience } = req.body;
  if (!name || !designation) {
    return res.status(400).json({ error: 'Owner name and designation are required.' });
  }

  const newOwner = db.createOwner({
    name,
    designation,
    bio: bio || '',
    experience: experience || '',
    areasOfExpertise: Array.isArray(req.body.areasOfExpertise) ? req.body.areasOfExpertise : [],
    phone: req.body.phone || '',
    email: req.body.email || '',
    photoUrl: req.body.photoUrl || '/images/owner_portrait_one_1792413400191.jpg',
    linkedin: req.body.linkedin || '',
    twitter: req.body.twitter || '',
    orderIndex: Number(req.body.orderIndex) || db.getOwners(true).length + 1,
    published: req.body.published !== undefined ? Boolean(req.body.published) : true
  });

  return res.status(201).json(newOwner);
});

apiRouter.put('/owners/:id', requireAdmin, (req, res) => {
  const updated = db.updateOwner(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Owner not found.' });
  }
  return res.json(updated);
});

apiRouter.delete('/owners/:id', requireAdmin, (req, res) => {
  const ok = db.deleteOwner(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Owner not found.' });
  }
  return res.json({ success: true });
});

// ==================== SERVICES ====================
apiRouter.get('/services', (_req, res) => {
  return res.json(db.getServices(false));
});

apiRouter.get('/admin/services', requireAdmin, (_req, res) => {
  return res.json(db.getServices(true));
});

apiRouter.put('/services/:id', requireAdmin, (req, res) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Service not found.' });
  }
  return res.json(updated);
});

// ==================== TESTIMONIALS ====================
apiRouter.get('/testimonials', (_req, res) => {
  return res.json(db.getTestimonials(false));
});

apiRouter.get('/admin/testimonials', requireAdmin, (_req, res) => {
  return res.json(db.getTestimonials(true));
});

apiRouter.post('/testimonials', requireAdmin, (req, res) => {
  const { clientName, comment } = req.body;
  if (!clientName || !comment) {
    return res.status(400).json({ error: 'Client name and review comment are required.' });
  }

  const item = db.createTestimonial({
    clientName,
    designation: req.body.designation || 'Client',
    propertyOrLocation: req.body.propertyOrLocation || 'Mathura',
    rating: Number(req.body.rating) || 5,
    comment,
    published: Boolean(req.body.published)
  });

  return res.status(201).json(item);
});

apiRouter.put('/testimonials/:id', requireAdmin, (req, res) => {
  const updated = db.updateTestimonial(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  return res.json(updated);
});

apiRouter.delete('/testimonials/:id', requireAdmin, (req, res) => {
  const ok = db.deleteTestimonial(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  return res.json({ success: true });
});

// ==================== ENQUIRIES ====================
apiRouter.post('/enquiries', (req, res) => {
  const { fullName, phone, email, message, enquiryType, propertyId, propertyTitle } = req.body;

  if (!fullName || !phone || !email || !message) {
    return res.status(400).json({ error: 'Full name, phone, email, and message are required.' });
  }

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (phone.trim().length < 8) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  const enq = db.createEnquiry({
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    enquiryType: enquiryType || 'General Inquiry',
    propertyId: propertyId || undefined,
    propertyTitle: propertyTitle || undefined,
    message: message.trim()
  });

  return res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. Our leadership team will contact you shortly.',
    enquiryId: enq.id
  });
});

apiRouter.get('/enquiries', requireAdmin, (_req, res) => {
  return res.json(db.getEnquiries());
});

apiRouter.put('/enquiries/:id', requireAdmin, (req, res) => {
  const updated = db.updateEnquiry(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }
  return res.json(updated);
});

apiRouter.delete('/enquiries/:id', requireAdmin, (req, res) => {
  const ok = db.deleteEnquiry(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }
  return res.json({ success: true });
});

apiRouter.get('/enquiries/export', requireAdmin, (_req, res) => {
  const enquiries = db.getEnquiries();
  const headers = ['ID', 'Date', 'Full Name', 'Phone', 'Email', 'Enquiry Type', 'Property Title', 'Status', 'Message'];
  
  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = enquiries.map(e => [
    escapeCsv(e.id),
    escapeCsv(new Date(e.createdAt).toLocaleString('en-IN')),
    escapeCsv(e.fullName),
    escapeCsv(e.phone),
    escapeCsv(e.email),
    escapeCsv(e.enquiryType),
    escapeCsv(e.propertyTitle || 'General'),
    escapeCsv(e.status),
    escapeCsv(e.message)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="shri_goyal_enquiries_${Date.now()}.csv"`);
  return res.send(csvContent);
});

// ==================== MEDIA LIBRARY ====================
apiRouter.get('/media', requireAdmin, (_req, res) => {
  return res.json(db.getMedia());
});

apiRouter.post('/media/upload', requireAdmin, upload.single('file'), (req: AuthenticatedRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const url = `/uploads/${req.file.filename}`;
  const item = db.addMedia({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url,
    category: (req.body.category as string) || 'general'
  });

  return res.status(201).json(item);
});

apiRouter.delete('/media/:id', requireAdmin, (req, res) => {
  const mediaList = db.getMedia();
  const item = mediaList.find(m => m.id === req.params.id);
  if (item && item.filename) {
    const filePath = path.join(UPLOADS_DIR, item.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to unlink uploaded file:', err);
      }
    }
  }

  const ok = db.deleteMedia(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Media asset not found.' });
  }
  return res.json({ success: true });
});
