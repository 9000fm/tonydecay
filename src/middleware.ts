import { NextRequest, NextResponse } from "next/server";

/* Teaser gate. While the site is in "coming-soon only" mode:
   - the root URL (/) serves the teaser (clean URL, no /coming-soon in the bar);
   - on the live deploy, every other route is locked to the teaser too, so dev work
     (store, /lab, /v2..v8) stays in the repo + deploy but is UNREACHABLE publicly.

   To open the full site later: delete this file.

   Allowed through in production: the teaser route, the waitlist API, Next internals,
   and the image/static assets the teaser needs. */

const ALLOW_PREFIX = ["/api/notify", "/_next", "/gallery", "/fonts"];
const ALLOW_EXACT = new Set(["/coming-soon", "/favicon.ico", "/robots.txt"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always serve the teaser at the root, keeping the URL as "/".
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }

  // Lock everything else to the teaser ONLY on the live deploy.
  // Local `npm run dev` is untouched so the rest of the site stays buildable.
  if (process.env.NODE_ENV === "production") {
    if (ALLOW_EXACT.has(pathname)) return NextResponse.next();
    if (ALLOW_PREFIX.some((p) => pathname.startsWith(p))) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next's static-optimization internals; run on everything else.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
