'use client';

import { addContactInformation } from '@/actions/checkout';
import useToast from '@/hooks/useToast';
import { useCheckoutContext } from '@/store/CheckoutProvider';
import { MessageType } from '@/store/MessageProvider';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type ContactInformationFormInput = {
    email: string;
    subscribe: boolean;
};

const ContactinformationForm: React.FC<{
    existingEmail: string | undefined;
}> = ({ existingEmail }: { existingEmail: string | undefined }) => {
    const { addAllowedIndex } = useCheckoutContext();

    //TODO: Implement subscribe
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isDirty },
    } = useForm<ContactInformationFormInput>({
        mode: 'onChange',
        defaultValues: {
            email: existingEmail,
            subscribe: true,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const toast = useToast();

    useEffect(() => {
        if (existingEmail) {
            addAllowedIndex(2);
        }
    }, []);

    const onSubmit: SubmitHandler<ContactInformationFormInput> = async (
        data
    ) => {
        try {
            setIsSubmitting(true);
            const response = await addContactInformation(
                data.email,
                data.subscribe
            );
            if (response.code >= 400) {
                setError(
                    'email',
                    {
                        type: 'manual',
                        message: response.message,
                    },
                    { shouldFocus: true }
                );
            } else {
                addAllowedIndex(2, 2);
            }
        } catch {
            toast(
                'Something went wrong while adding email!',
                MessageType.ERROR
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className='space-y-5 mt-5' onSubmit={handleSubmit(onSubmit)}>
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
            {/* TODO: Privacy and Terms */}
            <p className='text-xs md:text-sm text-gray-500'>
                By providing your email, you agree to our Privacy Policy and
                Terms.{' '}
            </p>
            <button
                disabled={isSubmitting || !isDirty}
                type='submit'
                title='Continue to shipping'
                className='primary-button'
            >
                {isSubmitting ? (
                    <Loader2 className='mx-auto animate-spin' />
                ) : (
                    'Save'
                )}
            </button>
            <div className='inline-flex gap-2 text-xs md:text-sm'>
                <input
                    {...register('subscribe')}
                    id='newsletter-subscribe'
                    type='checkbox'
                    className='accent-slate-900'
                />
                <label htmlFor='newsletter-subscribe'>
                    Subscribe to get special offers, and once-in-a-lifetime
                    deals.
                </label>
            </div>
        </form>
    );
};

export default ContactinformationForm;
