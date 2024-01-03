import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  //accessing request url/pathname
  const { pathname } = request.nextUrl;
  const publicRoute = pathname === "/login" || pathname === "/register";

  // If token is not present and if it is not a public route, then redirect to login
  if (!token && !publicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token is present and it is a public route, redirect to home
  if (token && publicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/"],
};
