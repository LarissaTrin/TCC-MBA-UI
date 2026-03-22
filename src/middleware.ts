import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware that protects private routes.
 *
 * 1. If no session exists → redirect to /login.
 * 2. If session exists but the backend token is invalid/expired
 *    → destroy session cookie and redirect to /login.
 * 3. Otherwise → allow the request through.
 *
 * This runs on every matched route (Board, Timeline, Project Settings, Profile, etc.)
 * ensuring stale or revoked tokens cannot access protected pages.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoginRoute = nextUrl.pathname.startsWith("/login");

  // Authenticated user trying to access login — redirect to home
  if (isLoginRoute && session?.user && session.tokenValid) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // No session at all — redirect to login
  if (!isLoginRoute && !session?.user) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists but the backend token validation failed (expired / revoked)
  if (!isLoginRoute && !session?.tokenValid) {
    const response = NextResponse.redirect(
      new URL("/login?error=SessionExpired", nextUrl.origin),
    );

    // Clear the session cookie so NextAuth doesn't keep the stale session
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login/:path*", "/", "/project", "/project/:path*", "/profile/:path*"],
};
