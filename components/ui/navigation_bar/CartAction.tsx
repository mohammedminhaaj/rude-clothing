'use client';

import { useCartContext } from '@/store/CartProvider';
import { useEffect } from 'react';
import { Loader, ShoppingBag } from 'react-feather';

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
	const { loadCart, cartState, toggleCart } = useCartContext();

	useEffect(() => {
		!cartState.cartReady && loadCart(data);
	});

	const numberOfItems = cartState.cart.length;

	return (
		<button
			type='button'
			title='cart'
			onClick={cartState.cartReady ? toggleCart : () => {}}
			className='relative transition-all hover:scale-110 duration-300'>
			<ShoppingBag strokeWidth={1} />
			{!cartState.cartReady ? (
				<Loader
					className='animate-spin absolute -top-1 -right-1'
					strokeWidth={1}
					size={15}
				/>
			) : (
				numberOfItems !== 0 && (
					<p className='absolute -top-1 -right-1 rounded-full px-1 bg-slate-800 text-white text-xs'>
						{numberOfItems}
					</p>
				)
			)}
		</button>
	);
};

export default CartAction;
