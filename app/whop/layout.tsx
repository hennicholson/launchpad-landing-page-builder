import { headers, cookies } from "next/headers";

export default async function WhopLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Get token from headers (Whop injects in production) or cookies
  const whopToken = headersList.get("x-whop-user-token") ||
                    cookieStore.get("whop_user_token")?.value || "";
  const whopUserId = headersList.get("x-whop-user-id") ||
                     cookieStore.get("whop_user_id")?.value || "";

  console.log("[Whop Layout] Auth capture:", {
    hasToken: !!whopToken,
    tokenLength: whopToken?.length || 0,
    hasUserId: !!whopUserId,
  });

  return (
    <>
      {/* Capture and store auth token BEFORE the page redirects */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var token = ${JSON.stringify(whopToken)};
              var userId = ${JSON.stringify(whopUserId)};
              console.log('[Whop Layout Script] Token available:', !!token, 'length:', token ? token.length : 0);
              if (token) {
                localStorage.setItem('whop-dev-token', token);
                console.log('[Whop Layout Script] Stored token in localStorage');
                // Decode JWT to get user_xxx ID
                try {
                  var parts = token.split('.');
                  if (parts.length === 3) {
                    var payload = JSON.parse(atob(parts[1]));
                    console.log('[Whop Layout Script] JWT payload sub:', payload.sub);
                    localStorage.setItem('whop-dev-user-id', payload.sub || userId || '');
                  }
                } catch(e) {
                  console.error('[Whop Layout Script] JWT decode error:', e);
                }
              } else {
                console.log('[Whop Layout Script] No token from server headers');
              }
              window.__WHOP_AUTH__ = { token: token, userId: userId };
            })();
          `,
        }}
      />
      {children}
    </>
  );
}
