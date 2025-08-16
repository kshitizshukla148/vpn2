import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/courses/purchased'];
  const adminRoutes = ['/admin'];

  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

      // Check admin access for admin routes
      if (isAdminRoute && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/purchased/:path*']
};