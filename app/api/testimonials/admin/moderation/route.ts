import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority') || 'all';
    const limit = searchParams.get('limit') || '20';
    const page = searchParams.get('page') || '1';
    const authHeader = request.headers.get('authorization') || '';

    // Build query parameters
    const params = new URLSearchParams({
      priority,
      limit,
      page
    });

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/moderation?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch moderation queue' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching moderation queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { testimonialId, action, notes, priority } = body;
    const authHeader = request.headers.get('authorization') || '';

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/moderation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ testimonialId, action, notes, priority }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to update moderation status' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating moderation status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
