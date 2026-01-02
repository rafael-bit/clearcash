import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/services/auth'
import { getUrl } from '@/lib/get-url'

export default auth((req) => {
	const { pathname } = req.nextUrl
	const isAuthenticated = !!req.auth

	// Don't interfere with API routes or NextAuth routes
	if (pathname.startsWith('/api/auth')) {
		return NextResponse.next()
	}

	// If user is authenticated and tries to access /auth, redirect to dashboard
	if (pathname === '/auth' && isAuthenticated) {
		return NextResponse.redirect(new URL(getUrl('/dashboard')))
	}

	// If user is not authenticated and tries to access /dashboard, redirect to auth
	if (pathname.startsWith('/dashboard') && !isAuthenticated) {
		return NextResponse.redirect(new URL(getUrl('/auth')))
	}

	return NextResponse.next()
})

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}