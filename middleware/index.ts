import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // PUBLIC ROUTES - Always accessible to everyone
    const publicRoutes = ['/', '/docs', '/sign-in', '/sign-up'];
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // PROTECTED ROUTES - Require authentication
    const protectedRoutes = ['/dashboard', '/dashboard/consultation', '/dashboard/portfolio', '/search'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Allow everything else
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|gradient.png).*)',
    ],
};
