import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from '@/lib/get-url'

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const sessionToken = 
		request.cookies.get('authjs.session-token')?.value ||
		request.cookies.get('__Secure-authjs.session-token')?.value ||
		request.cookies.get('next-auth.session-token')?.value
	
	const isAuthenticated = !!sessionToken

	if (pathname.startsWith('/api/auth')) {
		return NextResponse.next()
	}

	if (pathname === '/auth' && isAuthenticated) {
		return NextResponse.redirect(new URL(getUrl('/dashboard')))
	}

	if (pathname.startsWith('/dashboard') && !isAuthenticated) {
		return NextResponse.redirect(new URL(getUrl('/auth')))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}