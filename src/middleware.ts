import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: "__Secure-authjs.session-token",
    });

    const isLoggedIn = !!token;
    const isPublic = ["/login", "/register"].some((r) =>
        pathname.startsWith(r),
    );

    if (!isLoggedIn && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoggedIn && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
