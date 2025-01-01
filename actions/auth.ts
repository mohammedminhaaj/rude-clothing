'use server';

import { createClient } from '@/lib/supabase/server';
import { ServerResponse } from '@/lib/types';
import { SupabaseClient, User } from '@supabase/supabase-js';

export const getUser = async (
    supabase: SupabaseClient<any, 'public', any> | undefined = createClient()
) => {
    const user: User | null = (await supabase.auth.getUser()).data.user;
    return { user };
};

export const signupUser: (
    fullName: string,
    email: string,
    password: string
) => Promise<ServerResponse> = async (
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

    try {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            return {
                code: 400,
                message: error.message,
            } as ServerResponse;
        }
        return {
            code: 200,
            message: 'Account Created Successfully',
            data: { anonUserId },
        } as ServerResponse;
    } catch {
        return {
            code: 500,
            message: 'Something went wrong!',
        } as ServerResponse;
    }
};

export const loginUser: (
    email: string,
    password: string
) => Promise<ServerResponse> = async (email: string, password: string) => {
    const supabase = createClient();
    const { user } = await getUser(supabase);

    if (user && !user.is_anonymous) {
        return {
            code: 409,
            message: 'User is already logged in',
        } as ServerResponse;
    }
    const anonUserId = user?.id;

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return {
                code: 400,
                message: error.message,
            } as ServerResponse;
        }

        return {
            code: 200,
            message: 'User Logged In',
            data: { anonUserId },
        } as ServerResponse;
    } catch {
        return {
            code: 500,
            message: 'Something went wrong!',
        } as ServerResponse;
    }
};

export const passwordReset: (email: string) => Promise<ServerResponse> = async (
    email: string
) => {
    const supabase = createClient();
    const { user } = await getUser(supabase);
    if (user && !user.is_anonymous) {
        return {
            code: 409,
            message: 'User is already logged in',
        } as ServerResponse;
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            return {
                code: 400,
                message: error.message,
            } as ServerResponse;
        }

        return {
            code: 200,
            message: 'Password Reset Email Sent',
        } as ServerResponse;
    } catch {
        return {
            code: 500,
            message: 'Something went wrong!',
        } as ServerResponse;
    }
};

export const logoutUser: () => Promise<ServerResponse> = async () => {
    const supabase = createClient();
    const { user } = await getUser(supabase);
    if (!user || user.is_anonymous) {
        return {
            code: 409,
            message: 'User is already logged out',
        } as ServerResponse;
    }

    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return {
                code: 400,
                message: error.message,
            } as ServerResponse;
        }

        return {
            code: 200,
            message: 'User Logged Out',
        } as ServerResponse;
    } catch {
        return {
            code: 500,
            message: 'Something went wrong!',
        } as ServerResponse;
    }
};
