import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
	const { user, response } = await updateSession(request);

	const authUrls: string[] = ['/login', '/sign-up', '/forgot-password'];

	const requestPathName: string = request.nextUrl.pathname;

	if (user && !user.is_anonymous && authUrls.includes(requestPathName))
		return Response.redirect(new URL('/profile', request.url));

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
