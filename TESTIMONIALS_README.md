# Testimonials Feature Documentation

## Overview
The testimonials feature allows clients to submit reviews and feedback about their photography experience, which are then displayed on the website after admin approval.

## Features

### Frontend Components

#### 1. TestimonialsDisplay (`/app/components/TestimonialsDisplay.tsx`)
- Displays published testimonials in a responsive grid layout
- Service type filtering (wedding, portrait, landscape, food, events, commercial, other)
- Pagination support
- Featured testimonial section for the highest-rated review
- Star rating display
- Service type badges with color coding

#### 2. TestimonialForm (`/app/components/TestimonialForm.tsx`)
- User-friendly form for submitting testimonials
- Star rating system (1-5 stars)
- Service type selection
- Form progress indicator
- Character count for message field
- Success/error feedback
- Responsive design with smooth animations

### Backend API Routes

#### Public Routes
- `POST /api/testimonials/submit` - Submit new testimonial
- `GET /api/testimonials/published` - Get published testimonials with filtering and pagination

#### Admin Routes (Protected)
- `GET /api/testimonials/admin/all` - Get all testimonials for admin review
- `PUT /api/testimonials/admin/approve/:id` - Approve/publish testimonial
- `DELETE /api/testimonials/admin/:id` - Delete testimonial
- `GET /api/testimonials/admin/stats` - Get testimonial statistics

### Database Model

#### Testimonial Schema (`/backend/models/Testimonial.js`)
```javascript
{
  name: String (required, max 100 chars),
  email: String (required, lowercase),
  rating: Number (required, 1-5),
  message: String (required, max 500 chars),
  serviceType: String (enum: wedding, portrait, landscape, food, events, commercial, other),
  isApproved: Boolean (default: false),
  isPublished: Boolean (default: false),
  adminNotes: String (optional, max 200 chars),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## User Flow

### 1. Client Submits Testimonial
1. Client visits the testimonials section
2. Clicks "Share Your Experience" button
3. Fills out the testimonial form
4. Submits the form
5. Receives confirmation message

### 2. Admin Review Process
1. Admin logs into admin panel
2. Navigates to testimonials management
3. Reviews pending testimonials
4. Approves, rejects, or publishes testimonials
5. Adds admin notes if needed

### 3. Public Display
1. Approved testimonials appear on the main page
2. Users can filter by service type
3. Featured testimonial is highlighted
4. Pagination for large numbers of testimonials

## Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backend API Configuration
BACKEND_URL=http://localhost:5000

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Teofly Photography
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend Server
Ensure the backend server is running on the configured port (default: 5000) and has the testimonials routes properly configured.

## Security Features

- Rate limiting: One testimonial per email per 24 hours
- Input validation and sanitization
- Admin-only access to management functions
- Email verification (can be extended)

## Styling and UI

- Responsive design for all screen sizes
- Dark/light theme support
- Smooth animations and transitions
- Consistent color scheme with yellow accent
- Modern card-based layout
- Interactive elements with hover effects

## Future Enhancements

1. **Email Verification**: Send confirmation emails to testimonial submitters
2. **Photo Attachments**: Allow clients to attach photos with testimonials
3. **Social Sharing**: Share testimonials on social media platforms
4. **Review Moderation**: Advanced content filtering and moderation tools
5. **Analytics Dashboard**: Detailed insights into testimonial performance
6. **Multi-language Support**: International testimonials
7. **Testimonial Replies**: Allow business owners to respond to testimonials

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend server is running
   - Verify BACKEND_URL in environment variables
   - Check network connectivity

2. **Form Submission Issues**
   - Ensure all required fields are filled
   - Check browser console for JavaScript errors
   - Verify API endpoint accessibility

3. **Display Issues**
   - Clear browser cache
   - Check for CSS conflicts
   - Verify component imports

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Contributing

When contributing to the testimonials feature:

1. Follow the existing code style and patterns
2. Add proper TypeScript types for new features
3. Include error handling for all API calls
4. Test responsive design on multiple screen sizes
5. Update this documentation for any new features

## Support

For technical support or questions about the testimonials feature, please refer to the main project documentation or contact the development team.
