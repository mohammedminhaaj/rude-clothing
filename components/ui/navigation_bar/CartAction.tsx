'use client';

import { useCartContext } from '@/store/CartProvider';
import { useEffect } from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';

export type CartData = {
    id: number;
    quantity: number;
    productTag: {
        id: number;
        product: {
            id: string;
            name: string;
            price: string;
            productImages: {
                imagePath: string;
            }[];
        };
        tag: {
            name: string;
        };
    };
};

type CartActionProps = {
    data: CartData[];
};

const CartAction: React.FC<CartActionProps> = ({ data }: CartActionProps) => {
    const { loadCart, toggleCart, isReady, getCount } = useCartContext();

    useEffect(() => {
        !isReady() && loadCart(data);
    });

    const numberOfItems = getCount();

    return (
        <button
            type='button'
            disabled={!isReady()}
            title='cart'
            onClick={isReady() ? toggleCart : () => {}}
            className='relative transition-all hover:scale-110 duration-300'
        >
            <ShoppingBag className='stroke-1' />
            {!isReady() ? (
                <Loader2
                    className='stroke-1 animate-spin absolute -top-1 -right-1'
                    size={15}
                />
            ) : (
                numberOfItems !== 0 && (
                    <p className='absolute -top-1 -right-1 rounded-full px-2 bg-slate-800 text-white text-xs'>
                        {numberOfItems}
                    </p>
                )
            )}
        </button>
    );
};

export default CartAction;
