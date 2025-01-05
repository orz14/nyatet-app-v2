import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token");

  const protectedPaths = ["/testing"];
  const isProtectedRoute = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (isProtectedRoute && !token) {
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/auth") && token) {
    url.pathname = "/testing";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|public).*)"],
};
