import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || '20';
    const page = searchParams.get('page') || '1';
    const authHeader = request.headers.get('authorization') || '';

    // Build query parameters
    const params = new URLSearchParams({
      limit,
      page
    });

    if (status && status !== 'all') {
      params.append('status', status);
    }

    if (category && category !== 'all') {
      params.append('category', category);
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/all?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch testimonials' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
