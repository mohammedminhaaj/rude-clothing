'use server';

import { createClient } from '@/lib/supabase/server';
import { IFormResponse } from '@/lib/types';
import {
	AuthError,
	AuthResponse,
	SupabaseClient,
	User,
} from '@supabase/supabase-js';

export const signupUser: (
	fullName: string,
	email: string,
	password: string
) => Promise<IFormResponse> = async (
	fullName: string,
	email: string,
	password: string
) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (user && !user.is_anonymous) {
		return {
			code: 409,
			message: 'User is already logged in',
		};
	}

	const anonUserId = user?.id;

	return supabase.auth
		.signUp({
			email: email,
			password: password,
			options: {
				data: {
					full_name: fullName,
				},
			},
		})
		.then((response: AuthResponse) => {
			if (response.error) {
				const error: AuthError = response.error;
				return {
					code: 400,
					message: error.message,
				};
			}

			return {
				code: 200,
				message: 'Account Created Successfully',
				payload: { anonUserId },
			} as IFormResponse;
		})
		.catch((error: any) => {
			return {
				code: 500,
				message: 'Something went wrong!',
			};
		});
};

export const loginUser: (
	email: string,
	password: string
) => Promise<IFormResponse> = async (email: string, password: string) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (user && !user.is_anonymous) {
		return {
			code: 409,
			message: 'User is already logged in',
		};
	}
	const anonUserId = user?.id;

	return supabase.auth
		.signInWithPassword({ email: email, password: password })
		.then((response: AuthResponse) => {
			if (response.error) {
				const error: AuthError = response.error;
				return {
					code: 400,
					message: error.message,
				};
			}

			return {
				code: 200,
				message: 'User Logged In',
				payload: { anonUserId },
			} as IFormResponse;
		})
		.catch((error: any) => {
			return {
				code: 500,
				message: 'Something went wrong!',
			};
		});
};

export const passwordReset: (email: string) => Promise<IFormResponse> = async (
	email: string
) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);
	if (user && !user.is_anonymous) {
		return {
			code: 409,
			message: 'User is already logged in',
		};
	}
	return supabase.auth
		.resetPasswordForEmail(email)
		.then((response) => {
			if (response.error) {
				const error: AuthError = response.error;
				return {
					code: 400,
					message: error.message,
				};
			}
			return {
				code: 200,
				message: 'Password Reset Email Sent',
			};
		})
		.catch((error: any) => {
			return {
				code: 500,
				message: 'Something went wrong!',
			};
		});
};

export const logoutUser: () => Promise<IFormResponse> = async () => {
	const supabase = createClient();
	const { user } = await getUser(supabase);
	if (!user || user.is_anonymous) {
		return {
			code: 409,
			message: 'User is already logged out',
		};
	}
	return supabase.auth
		.signOut()
		.then((response) => {
			if (response.error) {
				const error: AuthError = response.error;
				return {
					code: 400,
					message: error.message,
				};
			}

			return {
				code: 200,
				message: 'User Logged Out',
			};
		})
		.catch((error: any) => {
			return {
				code: 500,
				message: 'Something went wrong!',
			};
		});
};

export const getUser = async (supabase: SupabaseClient<any, 'public', any>) => {
	const user: User | null = (await supabase.auth.getUser()).data.user;
	return { user };
};
