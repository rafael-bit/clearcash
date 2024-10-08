import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	
	if (url.pathname.startsWith("/home")) {
		const lastActive = req.cookies.get("lastActive");
		const inactivityLimit = 3600000;

		if (lastActive) {
			const timeSinceLastActive = Date.now() - parseInt(lastActive.value, 10);

			if (timeSinceLastActive > inactivityLimit) {
				url.pathname = "/";
				return NextResponse.redirect(url);
			}
		}
	}

	const res = NextResponse.next();
	res.cookies.set("lastActive", Date.now().toString());
	return res;
}

export const config = {
	matcher: "/home/:path*"
};
