import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req) {
  const path = req.nextUrl.pathname;
  
  // Protect all /admin routes
  if (path.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev_only" });
    
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(url);
    }
  }

  // Set Security Headers
  const response = NextResponse.next();
  
  const cspHeader = `
    default-src 'self';
    connect-src 'self' https://api.cloudinary.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://dummyimage.com https://images.unsplash.com https://res.cloudinary.com https://pagead2.googlesyndication.com;
    font-src 'self';
    frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Apply CSP Header
  response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());
  
  // Protect against clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Sniffing protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Strict Transport Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/settings/:path*',
    '/comparison',
    '/blog/:slug*',
    // Add other public routes that aren't API or static
  ],
};
