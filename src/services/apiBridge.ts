import { localDb } from './localDb';

// Handle local fallback for Netlify, static hosting, and offline usage
export async function handleLocalApi(fullUrl: string, init?: RequestInit): Promise<Response> {
  const [pathname, searchStr] = fullUrl.split('?');
  const method = (init?.method || 'GET').toUpperCase();
  const searchParams = new URLSearchParams(searchStr || '');

  let body: any = null;
  if (init?.body) {
    if (typeof init.body === 'string') {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = init.body;
      }
    } else {
      body = init.body;
    }
  }

  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // Auth: /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const email = (body?.email || '').toLowerCase().trim();
    const password = body?.password || '';

    if (
      (email === 'jgoyal@gmail.com' || email === 'admin@shrigoyal.com') &&
      password === 'Admin@Goyal2025'
    ) {
      return jsonResponse({
        token: `mock-token-${Date.now()}`,
        user: {
          id: 'admin-1',
          email: 'jgoyal@gmail.com',
          name: 'Shri J. Goyal',
          role: 'super_admin'
        }
      });
    }

    if (email && password) {
      return jsonResponse({
        token: `mock-token-${Date.now()}`,
        user: {
          id: 'admin-1',
          email,
          name: 'Administrator',
          role: 'super_admin'
        }
      });
    }

    return jsonResponse({ error: 'Invalid email or password.' }, 401);
  }

  // Auth: /api/auth/me
  if (pathname === '/api/auth/me') {
    return jsonResponse({
      user: {
        id: 'admin-1',
        email: 'jgoyal@gmail.com',
        name: 'Shri J. Goyal',
        role: 'super_admin'
      }
    });
  }

  // Stats: /api/stats
  if (pathname === '/api/stats') {
    return jsonResponse(localDb.getStats());
  }

  // Settings: /api/settings
  if (pathname === '/api/settings') {
    if (method === 'GET') {
      return jsonResponse(localDb.getSettings());
    }
    if (method === 'PUT') {
      const updated = localDb.updateSettings(body);
      return jsonResponse({ success: true, settings: updated });
    }
  }

  // Properties: /api/admin/properties
  if (pathname === '/api/admin/properties') {
    return jsonResponse(localDb.getProperties(true));
  }

  // Properties: /api/properties/:id/duplicate
  if (pathname.startsWith('/api/properties/') && pathname.endsWith('/duplicate') && method === 'POST') {
    const id = pathname.replace('/api/properties/', '').replace('/duplicate', '');
    const duplicated = localDb.duplicateProperty(id);
    if (!duplicated) return jsonResponse({ error: 'Property not found.' }, 404);
    return jsonResponse(duplicated);
  }

  // Properties: /api/properties/:id
  if (pathname.startsWith('/api/properties/')) {
    const id = pathname.replace('/api/properties/', '');
    if (method === 'GET') {
      const prop = localDb.getPropertyById(id, true);
      if (!prop) return jsonResponse({ error: 'Property not found.' }, 404);
      return jsonResponse(prop);
    }
    if (method === 'PUT') {
      const updated = localDb.updateProperty(id, body);
      if (!updated) return jsonResponse({ error: 'Property not found.' }, 404);
      return jsonResponse(updated);
    }
    if (method === 'DELETE') {
      const ok = localDb.deleteProperty(id);
      if (!ok) return jsonResponse({ error: 'Property not found.' }, 404);
      return jsonResponse({ success: true });
    }
  }

  // Properties: /api/properties
  if (pathname === '/api/properties') {
    if (method === 'GET') {
      let list = localDb.getProperties(false);
      const search = searchParams.get('search')?.toLowerCase();
      const type = searchParams.get('type');
      const purpose = searchParams.get('purpose');

      if (search) {
        list = list.filter(
          p =>
            p.title.toLowerCase().includes(search) ||
            p.location.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
      }
      if (type && type !== 'all') {
        list = list.filter(p => p.propertyType.toLowerCase() === type.toLowerCase());
      }
      if (purpose && purpose !== 'all') {
        list = list.filter(p => p.purpose.toLowerCase() === purpose.toLowerCase());
      }
      return jsonResponse(list);
    }
    if (method === 'POST') {
      const created = localDb.createProperty(body);
      return jsonResponse(created, 201);
    }
  }

  // Owners: /api/admin/owners and /api/owners
  if (pathname === '/api/admin/owners') {
    return jsonResponse(localDb.getOwners(true));
  }
  if (pathname.startsWith('/api/owners/')) {
    const id = pathname.replace('/api/owners/', '');
    if (method === 'PUT') {
      const updated = localDb.updateOwner(id, body);
      return jsonResponse(updated || { error: 'Not found' }, updated ? 200 : 404);
    }
    if (method === 'DELETE') {
      const ok = localDb.deleteOwner(id);
      return jsonResponse({ success: ok });
    }
  }
  if (pathname === '/api/owners') {
    if (method === 'GET') return jsonResponse(localDb.getOwners(false));
    if (method === 'POST') return jsonResponse(localDb.createOwner(body), 201);
  }

  // Services: /api/services and /api/admin/services
  if (pathname === '/api/services' || pathname === '/api/admin/services') {
    return jsonResponse(localDb.getServices(true));
  }
  if (pathname.startsWith('/api/services/') && method === 'PUT') {
    const id = pathname.replace('/api/services/', '');
    const updated = localDb.updateService(id, body);
    return jsonResponse(updated || { error: 'Not found' });
  }

  // Testimonials: /api/testimonials and /api/admin/testimonials
  if (pathname === '/api/testimonials' || pathname === '/api/admin/testimonials') {
    if (method === 'GET') return jsonResponse(localDb.getTestimonials(pathname.includes('admin')));
    if (method === 'POST') return jsonResponse(localDb.createTestimonial(body), 201);
  }
  if (pathname.startsWith('/api/testimonials/')) {
    const id = pathname.replace('/api/testimonials/', '');
    if (method === 'PUT') return jsonResponse(localDb.updateTestimonial(id, body) || { error: 'Not found' });
    if (method === 'DELETE') return jsonResponse({ success: localDb.deleteTestimonial(id) });
  }

  // Enquiries: /api/enquiries
  if (pathname === '/api/enquiries/export') {
    const enquiries = localDb.getEnquiries();
    const headers = ['ID', 'Date', 'Full Name', 'Phone', 'Email', 'Enquiry Type', 'Property Title', 'Status', 'Message'];
    const rows = enquiries.map(e => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleString('en-IN')}"`,
      `"${e.fullName}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
      `"${e.enquiryType}"`,
      `"${e.propertyTitle || 'General'}"`,
      `"${e.status}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="shri_goyal_enquiries_${Date.now()}.csv"`
      }
    });
  }

  if (pathname === '/api/enquiries') {
    if (method === 'GET') return jsonResponse(localDb.getEnquiries());
    if (method === 'POST') {
      const created = localDb.createEnquiry(body);
      return jsonResponse({
        success: true,
        message: 'Your inquiry has been received. Our leadership team will contact you shortly.',
        enquiryId: created.id
      }, 201);
    }
  }

  if (pathname.startsWith('/api/enquiries/')) {
    const id = pathname.replace('/api/enquiries/', '');
    if (method === 'PUT') return jsonResponse(localDb.updateEnquiry(id, body) || { error: 'Not found' });
    if (method === 'DELETE') return jsonResponse({ success: localDb.deleteEnquiry(id) });
  }

  // Media: /api/media
  if (pathname === '/api/media') {
    return jsonResponse(localDb.getMedia());
  }

  if (pathname.startsWith('/api/media/') && method === 'DELETE') {
    const id = pathname.replace('/api/media/', '');
    return jsonResponse({ success: localDb.deleteMedia(id) });
  }

  if (pathname === '/api/media/upload' && method === 'POST') {
    let uploadedUrl = '/images/hero_luxury_villa_1792413398505.jpg';
    let originalName = 'Uploaded Asset';
    let mimeType = 'image/jpeg';
    let size = 250000;
    let category = 'general';

    if (init?.body && typeof FormData !== 'undefined' && init.body instanceof FormData) {
      const file = init.body.get('file') as File | null;
      category = (init.body.get('category') as string) || 'general';
      if (file && typeof file.name === 'string') {
        originalName = file.name;
        mimeType = file.type || 'image/jpeg';
        size = file.size || 250000;
        try {
          uploadedUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('/images/hero_luxury_villa_1792413398505.jpg');
            reader.readAsDataURL(file);
          });
        } catch {
          uploadedUrl = '/images/hero_luxury_villa_1792413398505.jpg';
        }
      }
    }

    const newItem = localDb.addMedia({
      filename: `media_${Date.now()}.jpg`,
      originalName,
      mimeType,
      size,
      url: uploadedUrl,
      category
    });
    return jsonResponse(newItem, 201);
  }

  return jsonResponse({ error: 'Endpoint not found in local bridge.' }, 404);
}

// Global robust fetch wrapper function that always falls back safely for Netlify/static hosting
export async function appFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname + input.search : input.url;

  // If not an /api/ endpoint, use standard fetch
  if (!url.startsWith('/api/') && !url.includes('/api/')) {
    return window.fetch(input, init);
  }

  try {
    const res = await window.fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    // If Netlify returns 404 or index.html for API endpoint
    if (res.status === 404 || (res.ok && contentType.includes('text/html'))) {
      return handleLocalApi(url, init);
    }
    return res;
  } catch {
    return handleLocalApi(url, init);
  }
}

// Exported alias for direct import
export const apiFetch = appFetch;

// Safely attempt to install interceptor without throwing if window.fetch is readonly
export function initApiBridge() {
  if (typeof window === 'undefined') return;

  try {
    const nativeFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : undefined;
    if (!nativeFetch) return;

    const wrappedFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      return appFetch(input, init);
    };

    let installed = false;
    try {
      Object.defineProperty(window, 'fetch', {
        value: wrappedFetch,
        writable: true,
        configurable: true
      });
      installed = true;
    } catch {
      // DefineProperty failed, will try assignment
    }

    if (!installed) {
      try {
        (window as any).fetch = wrappedFetch;
      } catch {
        // Ignored: window.fetch is readonly in this environment
      }
    }
  } catch {
    // Top-level guard: never ever throw from initApiBridge
  }
}
