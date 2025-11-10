import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login"];

  const isPublic = publicPaths.some((route) => pathname.startsWith(route));

  // if (!token && !isPublic) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};

