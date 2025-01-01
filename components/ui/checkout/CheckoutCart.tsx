'use client';

import { useCartContext } from '@/store/CartProvider';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import CartItems from '../cart/CartItems';
import Link from 'next/link';
import CheckoutCartSkeleton from './CheckoutCartSkeleton';
import CouponForm from '@/components/forms/CouponForm';
import CheckoutCartTotal from './CheckoutCartTotal';
import Skeleton from '../Skeleton';

type CheckoutCartHeaderType = {
    setToggleCheckoutCart: () => void;
    toggleCheckoutCart: boolean;
};

const CheckoutCartHeader: React.FC<CheckoutCartHeaderType> = ({
    setToggleCheckoutCart,
    toggleCheckoutCart,
}: CheckoutCartHeaderType) => {
    const { getTotal, getCount, isReady } = useCartContext();

    const subTotalAmount = getTotal().toFixed(2);

    if (!isReady())
        return (
            <header className='w-full flex items-center justify-between mb-5'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-14' />
            </header>
        );

    return (
        <header className='w-full flex justify-between gap-5 text-md md:text-lg'>
            <h2 className='uppercase text-md md:text-lg font-bold inline-flex items-center gap-2'>
                <ShoppingBag className='stroke-1' /> Cart ({getCount()})
            </h2>
            <h3 className='hidden md:block'>INR {subTotalAmount}</h3>
            <button
                onClick={setToggleCheckoutCart}
                className='flex items-center gap-2 md:hidden'
            >
                INR {subTotalAmount}
                <ChevronDown
                    className={`stroke-1 ${
                        toggleCheckoutCart ? 'rotate-180' : ''
                    } transition-all duration-300`}
                />
            </button>
        </header>
    );
};

const CheckoutCart: React.FC = () => {
    const [toggleCheckoutCart, setToggleCheckoutCart] =
        useState<boolean>(false);
    const { getCount, isReady } = useCartContext();
    if (getCount() === 0 && isReady())
        return (
            <section className='flex flex-col items-center justify-center gap-5'>
                <h2 className='font-bold'>
                    You don't have anything added in your cart!
                </h2>
                <Link href={'/shop'} className='secondary-button !w-fit'>
                    Shop Now
                </Link>
            </section>
        );

    return (
        <>
            <CheckoutCartHeader
                toggleCheckoutCart={toggleCheckoutCart}
                setToggleCheckoutCart={() =>
                    setToggleCheckoutCart((prev) => !prev)
                }
            />

            <section
                className={`${
                    toggleCheckoutCart ? 'block' : 'hidden'
                } md:block mt-5 divide-y space-y-5`}
            >
                {isReady() ? (
                    <>
                        <section className='max-h-[50dvh] overflow-x-hidden overflow-y-scroll'>
                            <CartItems />
                        </section>

                        <CouponForm />
                        <CheckoutCartTotal />
                    </>
                ) : (
                    <CheckoutCartSkeleton />
                )}
            </section>
        </>
    );
};

export default CheckoutCart;
