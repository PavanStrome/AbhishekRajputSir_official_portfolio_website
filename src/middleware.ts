import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || "professor-academic-portfolio-fallback-secret-2026-key";
const key = new TextEncoder().encode(SECRET_KEY);
const SESSION_COOKIE_NAME = "professor_auth_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
      if (payload && payload.role === "ADMIN") {
        isValidSession = true;
      }
    } catch {
      isValidSession = false;
    }
  }

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  // Protecting Admin Dashboard Pages
  if (pathname.startsWith("/admin")) {
    if (isAuthPage) {
      if (isValidSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!isValidSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protecting Admin API Routes
  if (pathname.startsWith("/api/admin")) {
    if (!isValidSession) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
