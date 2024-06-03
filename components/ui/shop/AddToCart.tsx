import { addToCart } from '@/actions/cart';
import useToast from '@/hooks/useToast';
import { MessageType } from '@/store/MessageProvider';
import { useState } from 'react';
import { Loader } from 'react-feather';

type AddToCartProps = {
	isOutOfStock: boolean;
	isDisabled: boolean;
	selectedTag: number | null;
};

const AddToCart: React.FC<AddToCartProps> = ({
	isOutOfStock,
	isDisabled,
	selectedTag,
}: AddToCartProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const toast = useToast();

	const handleAddToCart = async () => {
		setIsLoading(true);
		const data = await addToCart(selectedTag!);
		if (data.code >= 400) {
			toast(data.message!, MessageType.ERROR);
		} else {
			toast(data.message!);
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
			className='font-bold uppercase w-full p-3 rounded bg-slate-600 hover:bg-slate-800 text-white transition-colors duration-300 disabled:bg-slate-300 flex items-center justify-center'>
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
