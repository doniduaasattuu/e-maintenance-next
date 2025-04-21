import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { onlyAdmin } from "./lib/config";

// Daftar route yang dilindungi dan role yang diizinkan untuk mengaksesnya
const protectedRoutesConfig: Record<string, string[]> = {
  "/users": onlyAdmin,
  "/functional-locations/[id]/edit": onlyAdmin,
  "/equipments/[id]/edit": onlyAdmin,
  "/materials/[id]/edit": onlyAdmin,
  // "/files/[id]/edit": onlyAdmin,
  // "/findings/[id]/edit": leader,
  "/functional-locations/create": onlyAdmin,
  "/equipments/create": onlyAdmin,
  "/materials/create": onlyAdmin,
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Redirect logged-in users away from /login and /register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!token && !isAuthRoute && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check authorization for protected routes
  if (token && isProtectedRoute(pathname)) {
    const userRole = token.role as string | undefined;
    const matchedRoutePattern = Object.keys(protectedRoutesConfig).find(
      (routePattern) => {
        const regexPattern = `^${routePattern.replace(/\[.*?\]/g, "[^/]+")}$`;
        const regex = new RegExp(regexPattern);
        return regex.test(pathname);
      }
    );

    if (matchedRoutePattern) {
      const allowedRoles = protectedRoutesConfig[matchedRoutePattern];
      if (!allowedRoles?.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Helper function to check if a path is a protected route (including dynamic routes)
function isProtectedRoute(path: string): boolean {
  return Object.keys(protectedRoutesConfig).some((routePattern) => {
    // Convert route pattern to a regex that matches dynamic segments
    const regexPattern = `^${routePattern.replace(/\[.*?\]/g, "[^/]+")}$`;
    const regex = new RegExp(regexPattern);
    return regex.test(path);
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
