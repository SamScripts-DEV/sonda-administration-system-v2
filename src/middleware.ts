import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isAuth = request.cookies.get("token")

    const publicPaths = ["/auth/login", "/auth/forgot-password", "/auth/reset-password"];

    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }


    if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|Datacenter.jpg|servers.jpg|Cyber.jpg|LogoSONDA.png|.png|.jpg|.jpeg|.svg|.css|.js|api/public|public|auth/login|auth/forgot-password|auth/reset-password).*)"
    ]
}