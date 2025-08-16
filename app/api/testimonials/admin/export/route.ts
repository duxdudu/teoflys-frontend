import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const authHeader = request.headers.get('authorization') || '';

    // Build query parameters
    const params = new URLSearchParams({
      format
    });

    if (status && status !== 'all') {
      params.append('status', status);
    }

    if (category && category !== 'all') {
      params.append('category', category);
    }

    if (dateFrom) {
      params.append('dateFrom', dateFrom);
    }

    if (dateTo) {
      params.append('dateTo', dateTo);
    }

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/export?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to export testimonials' },
        { status: response.status }
      );
    }

    // Get the content type and data
    const contentType = response.headers.get('content-type') || 'application/json';
    const data = await response.arrayBuffer();

    // Return the exported data with appropriate headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="testimonials-export.${format === 'csv' ? 'csv' : 'json'}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting testimonials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
