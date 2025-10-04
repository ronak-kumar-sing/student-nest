import { NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken } from '@/lib/utils/jwt';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/verification',
  '/meetings',
  '/messages'
];

// Define auth routes (redirect if already authenticated)
const authRoutes = ['/login', '/signup'];

// Define public routes (always accessible)
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/forgot-password',
  '/reset-password'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and images
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Check if user is authenticated
  let isAuthenticated = false;
  let shouldRefresh = false;
  let userPayload = null;

  // First try access token
  if (accessToken) {
    try {
      userPayload = verifyAccessToken(accessToken);
      isAuthenticated = true;
    } catch (error) {
      console.log('Access token invalid/expired');
      shouldRefresh = true;
    }
  }

  // If access token failed but we have refresh token, mark for refresh
  if (!isAuthenticated && refreshToken) {
    try {
      verifyRefreshToken(refreshToken);
      shouldRefresh = true;
    } catch (error) {
      console.log('Refresh token also invalid/expired');
      // Both tokens invalid, user needs to login
    }
  }

  // Handle different route types
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated && !shouldRefresh) {
      // No valid tokens, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (shouldRefresh) {
      // Token refresh needed, continue to page but mark for client-side refresh
      const response = NextResponse.next();
      response.headers.set('X-Auth-Refresh-Needed', 'true');
      return response;
    }
    
    // User is authenticated, continue
    return NextResponse.next();
  }

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // User already authenticated, redirect to dashboard
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || getDashboardUrl(userPayload);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
    // Not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // Public routes - allow access
  return NextResponse.next();
}

function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname) {
  return authRoutes.includes(pathname);
}

function getDashboardUrl(userPayload) {
  if (!userPayload) return '/dashboard';
  
  switch (userPayload.role) {
    case 'student':
      return '/dashboard/student';
    case 'owner':
      return '/dashboard/owner';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};