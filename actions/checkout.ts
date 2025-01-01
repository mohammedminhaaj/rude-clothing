'use server';

import { createClient } from '@/lib/supabase/server';
import { ServerResponse } from '@/lib/types';

export const addContactInformation = async (
    email: string,
    subscribe: boolean
) => {
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.updateUser({
            data: { email: email },
        });

        //TODO: Add newsletter subscription

        if (error)
            return {
                code: 400,
                message: error.message,
            } as ServerResponse;

        return {
            code: 200,
            message: 'Metadata updated!',
        } as ServerResponse;
    } catch {
        return {
            code: 500,
            message: 'Something went wrong while updating the metadata!',
        } as ServerResponse;
    }
};
