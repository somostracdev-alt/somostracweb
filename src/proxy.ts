import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "somostrac_admin";
const COOKIE_VALUE = "active";

function isProtected(pathname: string) {
  return pathname === "/ops" || pathname.startsWith("/ops/") || pathname === "/admin" || pathname.startsWith("/admin/");
}

export function proxy(request: NextRequest) {
  if (!isProtected(request.nextUrl.pathname)) return NextResponse.next();
  if (request.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/ops", "/ops/:path*", "/admin", "/admin/:path*"],
};
