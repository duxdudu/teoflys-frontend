import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

export async function PUT(
  request: NextRequest
) {
  try {
    const body = await request.json();
    const { action, testimonialIds, updateData } = body;
    const authHeader = request.headers.get('authorization') || '';

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ action, testimonialIds, updateData }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to perform bulk action' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
