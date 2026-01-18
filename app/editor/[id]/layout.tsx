import { headers, cookies } from "next/headers";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Get token from headers (Whop injects) or cookies (middleware sets)
  const whopToken = headersList.get("x-whop-user-token") ||
                    cookieStore.get("whop_user_token")?.value || "";
  const whopUserId = headersList.get("x-whop-user-id") ||
                     cookieStore.get("whop_user_id")?.value || "";

  return (
    <>
      {/* Inject auth token for production iframe context and store in localStorage */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var token = ${JSON.stringify(whopToken)};
              var userId = ${JSON.stringify(whopUserId)};
              if (token) {
                localStorage.setItem('whop-dev-token', token);
                // Decode JWT to get user_xxx ID
                try {
                  var parts = token.split('.');
                  if (parts.length === 3) {
                    var payload = JSON.parse(atob(parts[1]));
                    localStorage.setItem('whop-dev-user-id', payload.sub || userId || '');
                  }
                } catch(e) {}
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
