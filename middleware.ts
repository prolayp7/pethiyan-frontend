import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonical storefront host — https://pethiyan.com only. www and http are
// aliases that must 301/308 straight to this host in a single hop (never
// chained through an intermediate www-but-https or non-www-but-http state).
const CANONICAL_HOST = "pethiyan.com";

// Auth is handled client-side via LoginModal in AccountLayoutClient.
// The middleware no longer redirects for auth so that:
// 1. Logged-in users aren't incorrectly redirected due to cross-domain cookie visibility
// 2. Unauthenticated users see a login popup instead of being taken to /login
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");

  const isWwwHost = host === `www.${CANONICAL_HOST}`;
  const isInsecure = host === CANONICAL_HOST && proto === "http";

  if (isWwwHost || isInsecure) {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(target, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// robots.txt and sitemap.xml are intentionally included so a crawler hitting
// them on the www/http host still gets redirected to the canonical origin,
// instead of receiving a 200 served from the wrong host.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
