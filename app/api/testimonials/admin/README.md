# Testimonials Admin API Routes

This directory contains all the API routes for managing testimonials in the admin panel.

## Routes Overview

### Core Admin Routes

#### `/api/testimonials/admin/all` - GET
- **Purpose**: Fetch all testimonials with filtering and pagination
- **Query Parameters**:
  - `status`: Filter by approval status (pending, approved, published, all)
  - `category`: Filter by service category
  - `limit`: Number of items per page (default: 20)
  - `page`: Page number (default: 1)
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/stats` - GET
- **Purpose**: Get comprehensive statistics about testimonials
- **Returns**: Total counts, status breakdowns, category stats, rating distribution
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/dashboard` - GET
- **Purpose**: Get dashboard overview with key metrics and quick actions
- **Returns**: Summary data for admin dashboard
- **Headers**: Requires `Authorization` header for admin access

### Individual Testimonial Management

#### `/api/testimonials/admin/approve/[id]` - PUT
- **Purpose**: Approve and update testimonial details
- **Body**: 
  ```json
  {
    "isApproved": boolean,
    "isPublished": boolean,
    "adminNotes": string
  }
  ```
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/reject/[id]` - PUT
- **Purpose**: Reject a testimonial with optional notes
- **Body**:
  ```json
  {
    "isApproved": false,
    "adminNotes": string,
    "rejectionReason": string
  }
  ```
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/[id]` - DELETE
- **Purpose**: Permanently delete a testimonial
- **Headers**: Requires `Authorization` header for admin access

### Advanced Admin Features

#### `/api/testimonials/admin/search` - GET
- **Purpose**: Advanced search with multiple filters
- **Query Parameters**:
  - `q`: Search query text
  - `status`: Approval status filter
  - `category`: Service category filter
  - `rating`: Rating filter
  - `dateFrom`: Start date filter
  - `dateTo`: End date filter
  - `limit`: Items per page
  - `page`: Page number
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/bulk` - PUT
- **Purpose**: Perform actions on multiple testimonials at once
- **Body**:
  ```json
  {
    "action": "approve" | "reject" | "publish" | "unpublish",
    "testimonialIds": ["id1", "id2", ...],
    "updateData": {
      "adminNotes": string,
      "priority": string
    }
  }
  ```
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/moderation` - GET/PUT
- **Purpose**: Manage moderation queue and priority
- **GET Query Parameters**:
  - `priority`: Filter by priority level
  - `limit`: Items per page
  - `page`: Page number
- **PUT Body**:
  ```json
  {
    "testimonialId": string,
    "action": "approve" | "reject" | "flag",
    "notes": string,
    "priority": "low" | "medium" | "high"
  }
  ```
- **Headers**: Requires `Authorization` header for admin access

#### `/api/testimonials/admin/export` - GET
- **Purpose**: Export testimonials data in various formats
- **Query Parameters**:
  - `format`: Export format (json, csv)
  - `status`: Filter by status
  - `category`: Filter by category
  - `dateFrom`: Start date filter
  - `dateTo`: End date filter
- **Returns**: File download with appropriate headers
- **Headers**: Requires `Authorization` header for admin access

## Authentication

All admin routes require a valid `Authorization` header with a Bearer token:

```
Authorization: Bearer <admin_token>
```

## Error Handling

All routes return consistent error responses:

```json
{
  "error": "Error message description"
}
```

With appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Backend Integration

All routes forward requests to the backend API at `${BACKEND_URL}/api/testimonials/admin/*` endpoints. The backend URL is configured via the `BACKEND_URL` environment variable.

## Usage Examples

### Approving a Testimonial
```typescript
const response = await fetch('/api/testimonials/admin/approve/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    isApproved: true,
    isPublished: false,
    adminNotes: 'Approved after review'
  })
});
```

### Bulk Actions
```typescript
const response = await fetch('/api/testimonials/admin/bulk', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    action: 'approve',
    testimonialIds: ['123', '456', '789'],
    updateData: {
      adminNotes: 'Bulk approved'
    }
  })
});
```

### Export Data
```typescript
const response = await fetch('/api/testimonials/admin/export?format=csv&status=published', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Handle file download
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'testimonials-export.csv';
a.click();
```
