import useToast from '@/hooks/useToast';
import { QuantityMode } from '@/lib/types';
import { useCartContext } from '@/store/CartProvider';
import { MessageType } from '@/store/MessageProvider';
import { useState } from 'react';
import { Loader, Minus, Plus } from 'react-feather';

type QuantityInputType = {
	currentQuantity: number;
	cartId: number;
};

const QuantityInput: React.FC<QuantityInputType> = ({
	currentQuantity,
	cartId,
}: QuantityInputType) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const { updateCart } = useCartContext();
	const toast = useToast();
	const handleQuantityClick = async (mode: QuantityMode) => {
		setIsUpdating(true);
		const response = await updateCart(cartId, mode);
		if (response.code >= 400) {
			toast(response.message!, MessageType.ERROR);
		}
		setIsUpdating(false);
	};
	return (
		<div className='border w-fit space-x-2 px-2 py-1 rounded flex items-center justify-center text-center'>
			{isUpdating ? (
				<Loader strokeWidth={1} size={15} className='animate-spin' />
			) : (
				<>
					<button
						type='button'
						onClick={() => {
							handleQuantityClick(QuantityMode.DECREASE);
						}}
						title='decrease product quantity'
						className='basis-1/3'>
						<Minus size={15} strokeWidth={1} />
					</button>
					<p className='basis-1/3 text-xs'>{currentQuantity}</p>
					<button
						onClick={() => {
							handleQuantityClick(QuantityMode.INCREASE);
						}}
						type='button'
						title='increase product quantity'
						className='basis-1/3'>
						<Plus size={15} strokeWidth={1} />
					</button>
				</>
			)}
		</div>
	);
};

export default QuantityInput;
