import { addToCart } from '@/actions/cart';
import useToast from '@/hooks/useToast';
import { MessageType } from '@/store/MessageProvider';
import { useState } from 'react';
import { Loader } from 'react-feather';
import { SingleProductTag } from './QuickAddSection';
import { useCartContext } from '@/store/CartProvider';

type AddToCartProps = {
	isOutOfStock: boolean;
	isDisabled: boolean;
	selectedTag: SingleProductTag | null;
	productId: string;
	productName: string;
	productPrice: string;
	productImage: string | undefined;
	handleToggleSidebar: () => void;
};

const AddToCart: React.FC<AddToCartProps> = ({
	isOutOfStock,
	isDisabled,
	selectedTag,
	productId,
	productName,
	productPrice,
	productImage,
	handleToggleSidebar,
}: AddToCartProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { insertCart, toggleCart } = useCartContext();

	const toast = useToast();

	const handleAddToCart = async () => {
		setIsLoading(true);
		const data = await insertCart(
			selectedTag!,
			productId,
			productName,
			productPrice,
			productImage
		);
		if (data.code >= 400) {
			toast(data.message!, MessageType.ERROR);
		} else {
			toast(data.message!);
			handleToggleSidebar();
			toggleCart();
		}
		setIsLoading(false);
	};

	const handleNotifyMe = () => {
		setIsLoading(true);
	};

	return (
		<button
			disabled={isDisabled || isLoading}
			onClick={isOutOfStock ? handleNotifyMe : handleAddToCart}
			className='primary-button'>
			{isOutOfStock ? (
				'Notify Me'
			) : isLoading ? (
				<Loader className='animate-spin text-black' strokeWidth={1} />
			) : (
				'Add to Cart'
			)}
		</button>
	);
};

export default AddToCart;
