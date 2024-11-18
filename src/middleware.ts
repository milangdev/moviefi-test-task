import { NextRequest, NextResponse } from "next/server";

/**
 * Checks if the user is authenticated and redirects accordingly.
 *
 * If the user is authenticated and accessing the login or signup page,
 * they will be redirected to the home page.
 *
 * If the user is not authenticated and accessing the add, edit, or home page,
 * they will be redirected to the login page.
 *
 * If the user is authenticated or accessing any other page, the request will
 * be allowed to proceed.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const currentPath = req.nextUrl.pathname;

  const protectedRoutes = ["/add", "/edit/:id", "/"];
  const authRoutes = ["/login", "/signup"];

  // If authenticated and accessing auth routes, redirect to the home page
  if (token && authRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If unauthenticated and accessing protected routes, redirect to login
  if (!token && protectedRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/add", "/edit/:id", "/", "/login", "/signup"],
};
