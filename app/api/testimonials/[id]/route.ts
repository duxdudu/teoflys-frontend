import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teoflys-backend.onrender.com';

// Required for static export - generates all possible ID values at build time
export async function generateStaticParams() {
  // Since we don't know all possible IDs at build time, return an empty array
  // This will make the route work with static export but won't pre-generate any specific pages
  return [];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/approve/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update testimonial');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete testimonial');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
