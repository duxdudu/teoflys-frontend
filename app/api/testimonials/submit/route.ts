import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation before forwarding
    if (!body.name || !body.email || !body.message || !body.rating || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message, rating, category' },
        { status: 400 }
      );
    }

    if (Number(body.rating) < 1 || Number(body.rating) > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Forward to backend to persist in MongoDB
    const response = await fetch(`${BACKEND_URL}/api/testimonials/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        email: String(body.email).toLowerCase(),
        rating: Number(body.rating),
        message: body.message,
        category: body.category
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to submit testimonial' },
        { status: response.status }
      );
    }

    // Return backend response as-is
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
