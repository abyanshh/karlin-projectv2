import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
//   const refreshToken = req.cookies.get("refreshToken")?.value;
//   const { pathname } = req.nextUrl;
//   const PUBLIC_PATHS = ["/login"];

//   if (refreshToken && (pathname === "/" || pathname === "/login")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
//   if (!refreshToken && !isPublic) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|api/login|api/register|api/refresh).*)",
//   ],
};
