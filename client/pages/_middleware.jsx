import { DRIFT_TOKEN } from "@/lib/hooks/use-signed-in";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req, event) {
  const pathname = req.nextUrl.pathname;
  const signedIn = !!req.cookies["drift-token"];
  const getURL = (pageName) => new URL(`/${pageName}`, req.url).href;
  if (pathname === "/signout") {
    const resp = NextResponse.redirect(getURL(""));
    resp.clearCookie(DRIFT_TOKEN);
    return resp;
  } else if (pathname === "/" && signedIn) {
    const resp = NextResponse.redirect(getURL("new"));
    return resp;
  }
  return NextResponse.next();
}
