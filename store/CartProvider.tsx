'use client';

import {
	addToCart,
	appendCart as appendCartAction,
	deleteCart,
	updateQuantity,
} from '@/actions/cart';
import { CartData } from '@/components/ui/navigation_bar/CartAction';
import { SingleProductTag } from '@/components/ui/shop/QuickAddSection';
import { QuantityMode, ServerResponse } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

export type CartItem = {
	id: number;
	quantity: number;
	productId: string;
	productName: string;
	productPrice: string;
	productImage?: string;
	selectedSize: string;
};

type CartState = {
	cart: CartItem[];
	isOpen: boolean;
	cartReady: boolean;
};

interface CartContextProps {
	cartState: CartState;
	loadCart: (data: CartData[]) => void;
	appendCart: (anonUserId: string) => Promise<ServerResponse>;
	removeCart: (id: number) => Promise<ServerResponse>;
	insertCart: (
		selectedTag: SingleProductTag,
		productId: string,
		productName: string,
		productPrice: string,
		productImage: string | undefined
	) => Promise<ServerResponse>;
	updateCart: (id: number, mode: QuantityMode) => Promise<ServerResponse>;
	getTotal: () => string;
	toggleCart: () => void;
}

const CartContext = createContext<CartContextProps>({
	cartState: { cart: [], isOpen: false, cartReady: false },
	loadCart: (data: CartData[]) => {},
	appendCart: (anonUserId: string) => Promise.resolve({ code: 0 }),
	removeCart: async (id: number) => Promise.resolve({ code: 0 }),
	insertCart: (
		selectedTag: SingleProductTag,
		productId: string,
		productName: string,
		productPrice: string,
		productImage: string | undefined
	) => Promise.resolve({ code: 0 }),
	updateCart: (id: number, mode: QuantityMode) =>
		Promise.resolve({ code: 0 }),
	getTotal: () => '',
	toggleCart: () => {},
});

export const CartProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [cartState, setCartState] = useState<CartState>({
		cart: [],
		isOpen: false,
		cartReady: false,
	});

	const loadCart = (data: CartData[]) => {
		const cartItems: CartItem[] = data.map((item) => ({
			id: item.id,
			quantity: item.quantity,
			productId: item.productTag.product.id,
			productName: item.productTag.product.name,
			productImage:
				item.productTag.product.productImages.length !== 0
					? item.productTag.product.productImages[0].imagePath
					: '',
			productPrice: item.productTag.product.price,
			selectedSize: item.productTag.tag.name,
		}));
		setCartState((prev) => ({
			...prev,
			cart: cartItems,
			cartReady: true,
		}));
	};

	const appendCart = async (anonUserId: string) => {
		setCartState((prev) => ({
			...prev,
			cartReady: false,
		}));
		try {
			const data = await appendCartAction(anonUserId);
			loadCart(data);
			return {
				code: 200,
				message: 'Cart appended',
			} as ServerResponse;
		} catch {
			setCartState((prev) => ({
				...prev,
				cartReady: true,
				cart: [],
			}));
			return {
				code: 500,
				message: 'Failed to update cart items',
			} as ServerResponse;
		}
	};

	const removeCart = async (id: number) => {
		const response = await deleteCart(id);
		if (response.code < 400) {
			setCartState((prev) => ({
				...prev,
				cart: prev.cart.filter((item) => item.id !== id),
			}));
		}
		return response;
	};

	const insertCart = async (
		selectedTag: SingleProductTag,
		productId: string,
		productName: string,
		productPrice: string,
		productImage: string | undefined
	) => {
		const response = await addToCart(selectedTag.id);
		if (response.code <= 400) {
			let currentCart = [...cartState.cart];

			const quantityUpdated: boolean | undefined =
				response.data?.quantityUpdated;

			if (quantityUpdated) {
				const id = response.data?.id as number;
				const newQuantity = response.data?.quantity as number;
				currentCart = currentCart.map((item) =>
					item.id === id ? { ...item, quantity: newQuantity } : item
				);
			} else {
				currentCart.push({
					id: response.data!.id,
					quantity: response.data!.quantity,
					productId: productId,
					productName: productName,
					productPrice: productPrice,
					productImage: productImage,
					selectedSize: selectedTag.name,
				});
			}

			setCartState((prev) => ({ ...prev, cart: currentCart }));
		}
		return {
			code: response.code,
			message: response.message,
		} as ServerResponse;
	};

	const updateCart = async (id: number, mode: QuantityMode) => {
		const response = await updateQuantity(id, mode);

		if (response.code <= 400) {
			const newQuantity = response.data!.quantity as number;
			if (newQuantity === 0) {
				await removeCart(id);
			} else {
				const updatedCart = cartState.cart.map((item) =>
					item.id === id ? { ...item, quantity: newQuantity } : item
				);
				setCartState((prev) => ({ ...prev, cart: updatedCart }));
			}
		}
		return response;
	};

	const getTotal = () => {
		return cartState.cart
			.reduce(
				(prev, curr) =>
					prev + parseFloat(curr.productPrice) * curr.quantity,
				0
			)
			.toFixed(2);
	};

	const toggleCart = () => {
		setCartState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
	};

	return (
		<CartContext.Provider
			value={{
				cartState,
				loadCart,
				appendCart,
				removeCart,
				insertCart,
				updateCart,
				getTotal,
				toggleCart,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCartContext: () => CartContextProps = () =>
	useContext(CartContext);
