import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { AuthResponse, User, UserResponse } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: '',
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: '',
						...options,
					});
				},
			},
		}
	);

	const userResponse: UserResponse = await supabase.auth.getUser();

	let user: User | null = userResponse.data.user;

	if (!user) {
		const anonUserResponse = await supabase.auth.signInAnonymously();
		user = anonUserResponse.data.user;
	}

	return { response, user };
}
