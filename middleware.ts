// middleware.ts
import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Define public routes that require authentication
 */
const isProtectedRoute = createRouteMatcher(["/cv(.*)", "/dashboard(.*)"]);

/**
 * Middleware to protect routes
 */
export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated && isProtectedRoute(req)) {
    // redirect to the login page here
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

/**
 * Configuration for the middleware.
 * This tells the middleware which routes to run on.
 */
export const config = {
  matcher: [
    // run on all pages & APIs except static assets and _next
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
