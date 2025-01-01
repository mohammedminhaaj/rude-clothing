'use client';

import useToast from '@/hooks/useToast';
import { MessageType } from '@/store/MessageProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthSubmitButton from '../ui/AuthSubmitButton';
import { passwordReset } from '@/actions/auth';
import { ServerResponse } from '@/lib/types';

export type PasswordResetFormInput = {
    email: string;
};

const PasswordResetForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordResetFormInput>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const toast = useToast();

    const { push } = useRouter();

    const onSubmit: SubmitHandler<PasswordResetFormInput> = async (data) => {
        try {
            setIsSubmitting(true);
            const response: ServerResponse = await passwordReset(data.email);
            if (response.code === 409) {
                toast(response.message, MessageType.INFO);
                push('/');
            } else if (response.code === 200) {
                toast(response.message);
                push('/login');
            } else {
                toast(response.message, MessageType.ERROR);
                reset({
                    email: '',
                });
            }
        } catch {
            toast(
                'Something went wrong. Please refresh and try again',
                MessageType.ERROR
            );
            reset({
                email: '',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            <div className='relative'>
                <input
                    id='email-field'
                    required
                    {...register('email', {
                        required: 'This field is required',
                        pattern: {
                            value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                            message: 'Please enter a valid email',
                        },
                    })}
                    className={`form-input peer ${errors.email ? 'error' : ''}`}
                    title='Email'
                    type='email'
                />
                <label
                    className={`form-label  ${errors.email ? 'error' : ''}`}
                    htmlFor='email-field'
                >
                    Email
                </label>
            </div>
            {errors.email && (
                <p className='text-xs text-red-500'>{errors.email.message}</p>
            )}
            <AuthSubmitButton
                isSubmitting={isSubmitting}
                text={'Continue'}
                textWhenSubmitting={'Sending Email'}
            />
        </form>
    );
};

export default PasswordResetForm;
