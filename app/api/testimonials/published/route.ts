import { NextRequest, NextResponse } from 'next/server';

// Backend base URL for proxying to Express API
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

// Mock testimonials data for local development (fallback only)
const mockPublishedTestimonials = [
  {
    _id: '1',
    name: 'Sarah & Michael',
    rating: 5,
    message: 'The photography team exceeded all our expectations! They captured every precious moment of our wedding with such artistry and attention to detail. The photos are absolutely stunning and we couldn\'t be happier with the results.',
    category: 'wedding',
    createdAt: '2023-12-15T10:00:00Z',
    status: 'published'
  },
  {
    _id: '2',
    name: 'Emma Rodriguez',
    rating: 5,
    message: 'Professional and creative portrait session. The photographer made me feel comfortable and confident, and the results were beyond my expectations. Highly recommended!',
    category: 'portrait',
    createdAt: '2023-11-20T14:30:00Z',
    status: 'published'
  },
  {
    _id: '3',
    name: 'David Chen',
    rating: 5,
    message: 'Outstanding landscape photography. The team captured the natural beauty of our hiking locations with breathtaking results. Every photo tells a story.',
    category: 'landscape',
    createdAt: '2023-10-08T09:15:00Z',
    status: 'published'
  },
  {
    _id: '4',
    name: 'Lisa Thompson',
    rating: 5,
    message: 'Amazing food photography for our restaurant. The images perfectly showcase our dishes and have significantly increased our social media engagement.',
    category: 'food',
    createdAt: '2023-09-12T16:45:00Z',
    status: 'published'
  },
  {
    _id: '5',
    name: 'James Wilson',
    rating: 5,
    message: 'Excellent event coverage for our corporate conference. Professional, punctual, and delivered high-quality photos that perfectly captured the energy of our event.',
    category: 'events',
    createdAt: '2023-08-25T11:20:00Z',
    status: 'published'
  },
  {
    _id: '6',
    name: 'Maria Garcia',
    rating: 5,
    message: 'Outstanding commercial photography for our product line. The images are professional, creative, and have helped us increase our sales significantly.',
    category: 'commercial',
    createdAt: '2023-07-18T13:10:00Z',
    status: 'published'
  },
  {
    _id: '7',
    name: 'Alex Johnson',
    rating: 5,
    message: 'Incredible maternity photography session. The photographer made me feel beautiful and comfortable throughout the entire process. The photos are absolutely magical.',
    category: 'portrait',
    createdAt: '2023-06-10T15:30:00Z',
    status: 'published'
  },
  {
    _id: '8',
    name: 'Rachel & Tom',
    rating: 5,
    message: 'Our engagement photoshoot was perfect! The photographer captured our love and personalities so beautifully. We couldn\'t be happier with the results.',
    category: 'portrait',
    createdAt: '2023-05-22T12:00:00Z',
    status: 'published'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Try backend first
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (category && category !== 'all') params.append('category', category);

      const response = await fetch(`${BACKEND_URL}/api/testimonials/published?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Backend error ${response.status}`);

      const backendData = await response.json();

      const normalized = (backendData?.testimonials || []).map((t: { serviceType?: string; category?: string }) => ({
        ...t,
        serviceType: t.serviceType || t.category || 'other'
      }));

      const pagination = backendData?.pagination || {};

      return NextResponse.json({
        testimonials: normalized,
        pagination: {
          currentPage: Number(pagination.currentPage ?? page),
          totalPages: Number(pagination.totalPages ?? (Math.ceil(normalized.length / limit) || 1)),
          total: Number(pagination.total ?? normalized.length),
          limit: Number(pagination.limit ?? limit),
          hasNext: Boolean(pagination.hasNext ?? (Number(pagination.currentPage ?? page) * Number(pagination.limit ?? limit) < Number(pagination.total ?? normalized.length))),
          hasPrev: Boolean(pagination.hasPrev ?? (Number(pagination.currentPage ?? page) > 1))
        }
      });
    } catch {
      // Fallback to local mock
      const filtered = category && category !== 'all' ? mockPublishedTestimonials.filter(t => t.category === category) : mockPublishedTestimonials;
      const start = (page - 1) * limit;
      const end = start + limit;
      const items = filtered.slice(start, end).map((t) => ({ ...t, serviceType: t.category }));
      const total = filtered.length;

    return NextResponse.json({
        testimonials: items,
      pagination: {
        currentPage: page,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          total,
        limit,
          hasNext: page * limit < total,
          hasPrev: page > 1
      }
    });
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
