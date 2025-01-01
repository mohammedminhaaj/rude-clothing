import { CartItem as CartItemType, useCartContext } from '@/store/CartProvider';
import Image from 'next/image';
import QuantityInput from './QuantityInput';
import { Package } from 'lucide-react';
import RemoveCartButton from './RemoveCartButton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { animatedCartItem, animatedCartList } from '@/lib/variants';

const CartItem: React.FC<{ cart: CartItemType }> = ({
    cart,
}: {
    cart: CartItemType;
}) => {
    const { toggleCart } = useCartContext();
    return (
        <motion.div
            variants={animatedCartItem}
            className='flex items-center gap-3'
        >
            <Link
                onClick={toggleCart}
                className='basis-3/12'
                href={`/shop/${cart.productId}`}
            >
                <figure className='relative bg-gray-300 rounded size-24'>
                    {cart.productImage ? (
                        <Image
                            src={cart.productImage}
                            alt='product image'
                            fill
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            className='rounded'
                        />
                    ) : (
                        <figcaption className='text-xs text-center uppercase text-white flex items-center justify-center h-full'>
                            No Image
                        </figcaption>
                    )}
                </figure>
            </Link>

            <div className='basis-7/12 space-y-2'>
                <Link onClick={toggleCart} href={`/shop/${cart.productId}`}>
                    <h4 className='text-sm uppercase'>{cart.productName}</h4>
                </Link>

                <p className='uppercase text-xs'>Size: {cart.selectedSize}</p>
                <p className='text-xs'>INR {cart.productPrice}</p>
                <QuantityInput
                    currentQuantity={cart.quantity}
                    cartId={cart.id}
                />
            </div>
            <RemoveCartButton cartId={cart.id} />
        </motion.div>
    );
};

const CartItems: React.FC = () => {
    const { getCart } = useCartContext();
    return (
        <motion.div
            initial='hidden'
            animate='visible'
            variants={animatedCartList}
            className='space-y-5'
        >
            <p className='text-xs'>Product</p>

            {getCart().map((item) => (
                <CartItem key={item.id} cart={item} />
            ))}

            {/* <span className="flex items-center gap-2 text-xs">
        <Package size={16} className="stroke-1" />
        <p>Estimated delivery 4-7 business days</p>
      </span> */}
        </motion.div>
    );
};

export default CartItems;
