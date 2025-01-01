'use client';

import {
    addToCart,
    appendCart as appendCartAction,
    deleteCart,
    updateQuantity,
} from '@/actions/cart';
import { CartData } from '@/components/ui/navigation_bar/CartAction';
import { SingleProductTag } from '@/components/ui/shop/QuickAddSection';
import { QuantityMode, ServerResponse, Coupon } from '@/lib/types';
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

enum CouponType {
    FIXED = 'FIXED',
    PERCENTAGE = 'PERCENTAGE',
}

type CartState = {
    cart: CartItem[];
    isOpen: boolean;
    cartReady: boolean;
    coupon: Coupon | null;
};

interface CartContextProps {
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
    getTotal: () => number;
    removeCoupon: () => void;
    applyCoupon: (coupon: Coupon) => void;
    couponErrors: () => {
        errorText: string | null;
        hasError: boolean;
    };
    getCouponDiscount: () => number | null;
    getSubTotal: () => number;
    getCount: () => number;
    getCart: () => CartItem[];
    getCoupon: () => Coupon | null;
    isVisible: () => boolean;
    isReady: () => boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextProps>({
    loadCart: (data: CartData[]) => {},
    appendCart: (anonUserId: string) =>
        Promise.resolve({ code: 0, message: '' }),
    removeCart: async (id: number) => Promise.resolve({ code: 0, message: '' }),
    insertCart: (
        selectedTag: SingleProductTag,
        productId: string,
        productName: string,
        productPrice: string,
        productImage: string | undefined
    ) => Promise.resolve({ code: 0, message: '' }),
    updateCart: (id: number, mode: QuantityMode) =>
        Promise.resolve({ code: 0, message: '' }),
    getTotal: () => 0,
    applyCoupon: (coupon: Coupon) => {},
    removeCoupon: () => {},
    couponErrors: () => ({
        errorText: null,
        hasError: false,
    }),
    getCouponDiscount: () => 0,
    getSubTotal: () => 0,
    getCount: () => 0,
    getCart: () => [],
    getCoupon: () => null,
    isVisible: () => false,
    isReady: () => false,
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
        coupon: null,
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

    const getSubTotal = () => {
        return cartState.cart.reduce(
            (prev, curr) =>
                prev + parseFloat(curr.productPrice) * curr.quantity,
            0
        );
    };

    const applyCoupon = (coupon: Coupon) => {
        setCartState((prev) => ({ ...prev, coupon: coupon }));
    };

    const removeCoupon = () => {
        setCartState((prev) => ({ ...prev, coupon: null }));
    };

    const couponErrors: () => {
        errorText: string | null;
        hasError: boolean;
    } = () => {
        const { coupon } = cartState;
        if (!coupon)
            return {
                errorText: 'No promo code selected.',
                hasError: false,
            };

        const currentDateTime = new Date(Date.now());

        const { validFrom, validUntil, minOrderAmount } = coupon;
        if (
            !(
                validFrom <= currentDateTime &&
                (!validUntil || (validUntil && validUntil >= currentDateTime))
            )
        )
            return {
                errorText: 'The promo code has expired',
                hasError: true,
            };

        const subTotalAmount = getSubTotal();

        if (minOrderAmount) {
            const parsedMinOrderAmount = parseFloat(minOrderAmount);
            if (subTotalAmount < parsedMinOrderAmount) {
                return {
                    errorText: `Add items worth INR ${
                        parsedMinOrderAmount - subTotalAmount
                    } more to avail this discount`,
                    hasError: true,
                };
            }
        }

        return {
            errorText: null,
            hasError: false,
        };
    };

    const getCouponDiscount = () => {
        const { coupon } = cartState;
        if (!coupon) return null;

        const { hasError } = couponErrors();
        if (hasError) return null;

        const { rate, maxDiscountAmount, couponType } = coupon;
        const parsedRate = parseFloat(rate);
        const parsedMaxDiscountAmount = maxDiscountAmount
            ? parseFloat(maxDiscountAmount)
            : null;

        let discountAmount: number | null;

        switch (couponType) {
            case CouponType.FIXED:
                discountAmount = parsedRate;
                break;

            case CouponType.PERCENTAGE:
                discountAmount = getSubTotal() * (parsedRate / 100);
                break;

            default:
                discountAmount = null;
        }

        return discountAmount;
    };

    const getTotal = () => {
        let subTotal = getSubTotal();

        const discountAmount = getCouponDiscount();
        if (!couponErrors().hasError && discountAmount)
            subTotal -= discountAmount;

        return subTotal;
    };

    const getCart = () => cartState.cart;

    const getCoupon = () => cartState.coupon;

    const getCount = () => cartState.cart.length;

    const isVisible = () => cartState.isOpen;

    const isReady = () => cartState.cartReady;

    const toggleCart = () => {
        setCartState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    return (
        <CartContext.Provider
            value={{
                getCart,
                loadCart,
                appendCart,
                removeCart,
                insertCart,
                updateCart,
                getTotal,
                getCoupon,
                applyCoupon,
                removeCoupon,
                couponErrors,
                getCouponDiscount,
                getSubTotal,
                getCount,
                isVisible,
                isReady,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext: () => CartContextProps = () =>
    useContext(CartContext);
