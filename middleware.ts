import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Main domains to skip (not custom domains)
const MAIN_DOMAINS = [
  'onwhop.com',
  'www.onwhop.com',
  'localhost',
  '127.0.0.1',
];

const MAIN_DOMAIN_SUFFIXES = [
  '.netlify.app',
  '.vercel.app',
  '.ngrok.io',
  '.ngrok-free.app',
];

// Cache for custom domain lookups (in-memory, per-instance)
const domainCache = new Map<string, { slug: string | null; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

async function lookupCustomDomain(domain: string, request: NextRequest): Promise<string | null> {
  // Check cache first
  const cached = domainCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.slug;
  }

  try {
    // Use internal API to avoid edge runtime database limitations
    const baseUrl = request.nextUrl.clone();
    baseUrl.pathname = '/api/domain/lookup';
    baseUrl.search = `?domain=${encodeURIComponent(domain)}`;

    const response = await fetch(baseUrl.toString(), {
      headers: {
        'x-internal-request': 'true',
      },
    });

    if (!response.ok) {
      console.error('Domain lookup API error:', response.status);
      return null;
    }

    const data = await response.json();
    const slug = data.slug || null;

    // Cache the result
    domainCache.set(domain, { slug, timestamp: Date.now() });

    return slug;
  } catch (error) {
    console.error('Error looking up custom domain:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip domain lookup API to prevent infinite loops
  if (pathname.startsWith('/api/domain/')) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const normalizedHost = host.split(':')[0].toLowerCase();

  // Check if this is a custom domain (not a main domain)
  const isMainDomain = MAIN_DOMAINS.includes(normalizedHost) ||
    MAIN_DOMAIN_SUFFIXES.some(suffix => normalizedHost.endsWith(suffix));

  if (!isMainDomain && normalizedHost) {
    // Look up custom domain via API
    const slug = await lookupCustomDomain(normalizedHost, request);

    if (slug) {
      // Rewrite to the landing page for this project
      const url = request.nextUrl.clone();
      url.pathname = `/s/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // Get the Whop auth headers (injected by Whop's proxy)
  const whopToken = request.headers.get('x-whop-user-token');
  const whopUserId = request.headers.get('x-whop-user-id');

  // Clone the response
  const response = NextResponse.next();

  // If we have Whop headers, set them as cookies so client-side fetch can use them
  // IMPORTANT: sameSite: 'none' + secure: true required for cross-origin iframe (Whop)
  if (whopToken) {
    response.cookies.set('whop_user_token', whopToken, {
      httpOnly: true,
      secure: true,    // Required for sameSite: 'none'
      sameSite: 'none', // Allow cross-origin iframe requests
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  if (whopUserId) {
    response.cookies.set('whop_user_id', whopUserId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

// Run middleware on ALL routes including API routes
// This ensures cookies are set even for client-side fetch calls
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
