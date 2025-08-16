# Deployment Configuration Guide

## Environment Variables

To deploy this Next.js application successfully, you need to set the following environment variables in your hosting platform (Vercel, Netlify, etc.):

### Required Environment Variables

```bash
NEXT_PUBLIC_BACKEND_URL=https://teoflys-backend.onrender.com
NEXT_PUBLIC_APP_NAME=Teofly Photography
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

### Backend Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://teofly-photography.onrender.com` (production)
- `https://teoflys-frontend.vercel.app` (alternative production)

### Image Optimization

The application is configured with `unoptimized: true` for images to ensure compatibility with static exports and to avoid conflicts with the Image Optimization API.

## Deployment Steps

1. **Set Environment Variables**: Add the above environment variables to your hosting platform
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next` (for Vercel) or `out` (for static export)
4. **Install Command**: `npm install`

## Troubleshooting

If you encounter "Request timed out" errors:
1. Verify the backend server is running at `https://teoflys-backend.onrender.com`
2. Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly
3. Ensure CORS is properly configured on the backend
4. Verify network connectivity between frontend and backend

## Local Development

For local development, the application will use:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

These are configured in `.env.local` for development purposes.
