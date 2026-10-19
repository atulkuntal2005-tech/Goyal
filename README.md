# Shri Goyal Associates | Premium Luxury Real Estate Advisory

A high-end, responsive real estate website and CMS built for **Shri Goyal Associates**, featuring editorial aesthetics, real-time database-backed settings, property listings, owner profiles, inquiry tracking, and a secure admin dashboard.

---

## Brand & Initial Business Information
- **Business Name:** Shri Goyal Associates
- **Phone Number:** `+91 9012792020`
- **WhatsApp Number:** `+91 9012792020`
- **Official Email:** `jgoyal@gmail.com`
- **Registered Address:** Mandi Choraha, Near Narsi Vihar, Mathura, Uttar Pradesh – 281004, India.

---

## Core Architecture & Features

### 1. Centralized Contact & Settings System
Every phone call button (`tel:+919012792020`), WhatsApp button (`https://wa.me/919012792020`), email link (`mailto:jgoyal@gmail.com`), and physical address throughout the entire website is dynamically driven by the centralized database.
- Updating contact information in `/admin/settings` immediately updates the Navbar, Hero, Property Cards, Footer, and Contact sections without touching code.

### 2. WhatsApp Enquiry with Prefilled Messages
- Every property card and property details page includes a dedicated WhatsApp enquiry button that automatically prefills the message:
  `"Hello Shri Goyal Associates, I am interested in [Property Title]. Please share more details."`

### 3. "Meet Our Owners" Dedicated Section & Page
- Showcases the two managing owners with professional photography, designations, bios, experience badges, areas of expertise, and direct contact buttons.
- Fully manageable from `/admin/owners` (reorder, edit details, replace portraits, toggle visibility, add new profiles).

### 4. Property Management
- Complete catalog with search by title/location, filters for Property Type (Luxury Villa, Penthouse, Commercial Space, Plot / Land, Apartment, Farmhouse), Purpose (Buy / Rent), and price sorting.
- Admin dashboard supports: Add, Edit, Duplicate, Publish / Draft toggle, Featured toggle, and Delete.
- Comprehensive image gallery manager with device file uploads.

### 5. Client Enquiries & Lead Pipeline
- All contact forms and site inspection requests are stored securely in the backend database.
- Admin Enquiry Manager at `/admin/enquiries` allows viewing full inquiries, filtering by status (`new`, `contacted`, `in_progress`, `resolved`), single-click Call, WhatsApp, and Email actions, and **Export to CSV**.

### 6. Media Asset Library
- Device image uploads directly stored to disk (`/uploads`) and served statically.
- URL copying and media category filtering.

---

## Admin Credentials
- **Admin Login Route:** `/admin`
- **Default Email:** `jgoyal@gmail.com` (or `admin@shrigoyal.com`)
- **Default Password:** `Admin@Goyal2025`

---

## Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Express, Node.js with Vite middleware integration
- **Storage:** Persistent JSON document store in `/data/db.json` with write atomicity
- **File Uploads:** Multer with file type validation in `/uploads`
- **Security:** Scrypt password hashing with unique salts, cryptographically signed Bearer session tokens
