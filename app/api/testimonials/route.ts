import { NextRequest, NextResponse } from 'next/server';

// Mock testimonials data for local development
const mockTestimonials = [
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
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');

    // Filter testimonials by category if specified
    let filteredTestimonials = mockTestimonials;
    if (category && category !== 'all') {
      filteredTestimonials = mockTestimonials.filter(
        testimonial => testimonial.category === category
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex);

    // Return response in the expected format
    return NextResponse.json({
      testimonials: paginatedTestimonials,
      total: filteredTestimonials.length,
      page,
      limit
    });
    
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create a new testimonial with mock ID and timestamp
    const newTestimonial = {
      _id: `new-${Date.now()}`,
      name: body.name,
      rating: body.rating,
      message: body.message,
      category: body.category,
      createdAt: new Date().toISOString(),
      status: 'pending' // New testimonials start as pending
    };

    // In a real app, you'd save this to a database
    console.log('New testimonial submitted:', newTestimonial);

    // Return success response
    return NextResponse.json({
      message: 'Testimonial submitted successfully',
      testimonial: newTestimonial
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
