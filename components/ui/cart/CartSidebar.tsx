'use client';

import { useCartContext } from '@/store/CartProvider';
import { AnimatePresence, motion } from 'framer-motion';
import Overlay from '../Overlay';
import { useEffect, useRef } from 'react';
import { Lock, X } from 'lucide-react';
import CartItems from './CartItems';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CartSidebar: React.FC = () => {
    const { getCount, toggleCart, getSubTotal, isVisible } = useCartContext();
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                toggleCart();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    });
    const { push } = useRouter();

    const totalAmount = getSubTotal().toFixed(2);

    return (
        <AnimatePresence>
            {isVisible() && (
                <Overlay>
                    <motion.aside
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ bounce: 0 }}
                        ref={sidebarRef}
                        className='fixed right-0 h-full bg-white w-full sm:w-3/4 md:w-2/4 lg:w-1/4 shadow-2xl'
                    >
                        <section className='p-5 flex flex-col gap-5 h-full'>
                            <header className='flex justify-between items-center border-b pb-5 basis-1/12'>
                                <h2 className='uppercase text-xl'>
                                    Cart ({getCount()})
                                </h2>
                                <button
                                    title='close cart'
                                    type='button'
                                    onClick={toggleCart}
                                    className='group transition-all duration-300 hover:scale-110'
                                >
                                    <X className='stroke-1 transition-all group-hover:rotate-180 duration-300' />
                                </button>
                            </header>
                            {getCount() === 0 ? (
                                <div className='h-full w-full flex flex-col gap-5 justify-center items-center'>
                                    <p className='text-xl '>
                                        Your cart is empty
                                    </p>
                                    <div className='w-fit'>
                                        <Link
                                            onClick={toggleCart}
                                            href={'/shop'}
                                            className='secondary-button'
                                        >
                                            Shop All
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <section className='basis-9/12 overflow-y-auto overflow-x-hidden '>
                                        <CartItems />
                                    </section>

                                    <section className='border-t pt-5 space-y-5 basis-2/12'>
                                        <div className='flex justify-between items-center'>
                                            <h4 className='uppercase font-bold'>
                                                Subtotal
                                            </h4>

                                            <motion.h3
                                                key={`total-${totalAmount}`}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className='text-2xl font-bold'
                                            >
                                                INR {totalAmount}
                                            </motion.h3>
                                        </div>
                                        <button
                                            onClick={() => {
                                                toggleCart();
                                                push('/checkout');
                                            }}
                                            type='button'
                                            title='checkout'
                                            className='primary-button'
                                        >
                                            <Lock
                                                size={20}
                                                className='stroke-1'
                                            />
                                            Check out
                                        </button>

                                        <p>
                                            <em className='text-xs font-extralight'>
                                                Shipping and discount code will
                                                be calculated at checkout
                                            </em>
                                        </p>
                                    </section>
                                </>
                            )}
                        </section>
                    </motion.aside>
                </Overlay>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
