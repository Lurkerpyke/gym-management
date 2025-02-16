// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Protected routes configuration
    const adminRoutes = ["/admin"];
    const authRoutes = ["/dashboard"];

    // Redirect unauthenticated users from protected routes
    if (authRoutes.some((p) => pathname.startsWith(p)) && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check admin routes
    if (adminRoutes.some((p) => pathname.startsWith(p))) {
        if (token?.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
}