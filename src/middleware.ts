import { NextRequest, NextResponse } from "next/server";

/* Teaser gate. While the site is in "coming-soon only" mode, every request on the
   live deploy is funneled to /coming-soon. Dev work (store, /lab, /v2..v8) stays in
   the repo + deploy but is UNREACHABLE on the public domain.

   - Only active in production (local `npm run dev` is untouched, so you can still
     build the rest of the site).
   - To open the full site later: delete this file.

   Allowed through: the teaser itself (served at / via next.config rewrite, and at
   /coming-soon), the waitlist API, Next internals, and the image/static assets the
   teaser needs. */

const ALLOW_EXACT = new Set(["/", "/coming-soon", "/favicon.ico", "/robots.txt"]);
const ALLOW_PREFIX = ["/api/notify", "/_next", "/gallery", "/fonts"];

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (ALLOW_EXACT.has(pathname)) return NextResponse.next();
  if (ALLOW_PREFIX.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Everything else is dev-only -> send it to the teaser.
  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next's static-optimization internals; run on everything else.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
