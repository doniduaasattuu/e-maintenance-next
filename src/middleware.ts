import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Redirect logged-in users away from /login and /register to homepage
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed if no conditions match
  return NextResponse.next();
}

// Apply middleware to all routes except static, API, and public files
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
