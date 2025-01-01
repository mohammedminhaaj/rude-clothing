'use client';

import { validateCoupon } from '@/actions/cart';
import useToast from '@/hooks/useToast';
import { Coupon } from '@/lib/types';
import { useCartContext } from '@/store/CartProvider';
import { MessageType } from '@/store/MessageProvider';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CouponBanner from '../ui/checkout/CouponBanner';

type CouponFormInput = {
    coupon: string;
};

const CouponForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CouponFormInput>();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { getCoupon, applyCoupon } = useCartContext();

    const toast = useToast();

    const onSubmit: SubmitHandler<CouponFormInput> = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await validateCoupon(data.coupon);
            if (response.code >= 400) {
                setError(
                    'coupon',
                    {
                        type: 'manual',
                        message: response.message,
                    },
                    { shouldFocus: true }
                );
            } else {
                applyCoupon(response.data as Coupon);
                reset();
            }
        } catch {
            toast(
                'Something went wrong while applying coupon!',
                MessageType.ERROR
            );
            reset();
        } finally {
            setIsSubmitting(false);
        }
    };

    const coupon = getCoupon();

    return (
        <section>
            {coupon ? (
                <CouponBanner
                    code={coupon.code}
                    description={coupon.description}
                />
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex items-center pt-5'
                    >
                        <div className='relative w-full'>
                            <input
                                id='coupon-field'
                                required
                                {...register('coupon', {
                                    required: 'This field is required',
                                })}
                                className={`form-input peer ${
                                    errors.coupon && 'error'
                                }`}
                                title='Promo Code'
                                type='text'
                            />
                            <label
                                className={`form-label  ${
                                    errors.coupon && 'error'
                                }`}
                                htmlFor='email-field'
                            >
                                Promo Code
                            </label>
                        </div>
                        <button
                            className='primary-button !w-fit scale-90'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className='mx-auto animate-spin' />
                            ) : (
                                'Apply'
                            )}
                        </button>
                    </form>

                    {errors.coupon && (
                        <p className='text-xs text-red-500 block'>
                            {errors.coupon.message}
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

export default CouponForm;
