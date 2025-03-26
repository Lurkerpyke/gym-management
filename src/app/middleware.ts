// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req: req});
    const { pathname } = req.nextUrl;
    const session = req.cookies.get('next-auth.session-token');
    const path = req.nextUrl.pathname;

    // Protected routes configuration
    const adminRoutes = ["/admin"];
    const authRoutes = ["/dashboard"];

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/owner')) {
        if (!token || token.role !== 'owner') {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

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

    // Redireciona não autenticados para entrada
    if (!token && !req.nextUrl.pathname.startsWith('/entrada')) {
        return NextResponse.redirect(new URL('/entrada', req.url));
    }

    // Redireciona autenticados para longe da entrada
    if (token && req.nextUrl.pathname.startsWith('/entrada')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/owner')) {
        if (!session) {
            return NextResponse.redirect(new URL('/signin', req.url))
        }
    }

    if (path.startsWith('/posts')) {
        const session = req.cookies.get('next-auth.session-token');
        if (!session) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    return NextResponse.next();
}