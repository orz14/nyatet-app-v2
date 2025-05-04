import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token");

  const protectedPaths = ["/todo", "/note", "/user", "/role", "/logs", "/profil", "/tools"];
  const isProtectedRoute = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (isProtectedRoute && !token) {
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/auth") && token) {
    url.pathname = "/todo";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|public).*)"],
};
