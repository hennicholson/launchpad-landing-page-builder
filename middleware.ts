import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the Whop auth headers (injected by Whop's proxy)
  const whopToken = request.headers.get('x-whop-user-token');
  const whopUserId = request.headers.get('x-whop-user-id');

  // Clone the response
  const response = NextResponse.next();

  // If we have Whop headers, set them as cookies so client-side fetch can use them
  // IMPORTANT: sameSite: 'none' + secure: true required for cross-origin iframe (Whop)
  if (whopToken) {
    response.cookies.set('whop_user_token', whopToken, {
      httpOnly: false, // Allow JS access for debugging
      secure: true,    // Required for sameSite: 'none'
      sameSite: 'none', // Allow cross-origin iframe requests
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  if (whopUserId) {
    response.cookies.set('whop_user_id', whopUserId, {
      httpOnly: false,
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
