import { NextRequest, NextResponse } from "next/server";
import { ResponseUtils } from "./components/ResponseUtils";

const allowedPathNames = ["/music/get", "music/get/info", "net/proxy", "/favicon.ico", "_next/.*"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // console.log(pathname + " is being requested")
    if (!allowedPathNames.some(allowedPath => new RegExp(`^${allowedPath}(/|\\?)?(\\?[^/]+)?$`).test(pathname))) {
        return ResponseUtils.wrong("pathname. Nothing here.");
    }
    return NextResponse.next();
}