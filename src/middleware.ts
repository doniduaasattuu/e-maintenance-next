import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { onlyAdmin, users } from "./lib/config";

// Daftar route yang dilindungi dan role yang diizinkan untuk mengaksesnya
const protectedRoutesConfig: Record<string, string[]> = {
  "/home": users,
  "/profile": users,
  "/scanner": users,

  "/users": onlyAdmin,

  "/functional-locations": users,
  "/functional-locations/[id]": users,
  "/functional-locations/[id]/edit": onlyAdmin,
  "/functional-locations/create": onlyAdmin,

  "/equipments": users,
  "/equipments/[id]": users,
  "/equipments/[id]/edit": onlyAdmin,
  "/equipments/create": onlyAdmin,

  "/materials": users,
  "/materials/[id]": users,
  "/materials/[id]/edit": onlyAdmin,
  "/materials/create": onlyAdmin,

  "/findings": users,
  "/findings/[id]/edit": users,
  "/findings/create": users,

  "/files": users,
  "/files/[id]/edit": users,
  "/files/create": users,

  "/inspections/[id]/create": users,
  "/inspections/[id]/edit[inspectionId]": users,
  "/inspections/[id]/history": users,
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
