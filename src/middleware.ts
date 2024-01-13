import { env } from "@/env.mjs";
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {

    const nextAuthToken = req.cookies.get("__Secure-next-auth.session-token")?.value || req.cookies.get("next-auth.session-token")?.value;
    let isAuth;

    if (!!nextAuthToken) {
      const verifyTokenReq = await fetch(`${req.nextUrl.origin}/api/auth/verifytoken`, {
        method: "POST",
        body: JSON.stringify({ token: nextAuthToken })
      })

      const verifyToken = await verifyTokenReq.json()
      isAuth = verifyToken.ok;
    } else {
      isAuth = false;
    }

    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url))
      }

      return null
    }

    if (!isAuth) {

      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      if (from === "/")

        return NextResponse.redirect(
          new URL(`/login`, req.url)
        );
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    secret: env.NEXTAUTH_SECRET,
    callbacks: {
      async authorized({ req, token }) {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)