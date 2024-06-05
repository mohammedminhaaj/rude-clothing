import useToast from '@/hooks/useToast';
import { useCartContext } from '@/store/CartProvider';
import { MessageType } from '@/store/MessageProvider';
import { useState } from 'react';
import { Loader } from 'react-feather';

const RemoveCartButton: React.FC<{ cartId: number }> = ({
	cartId,
}: {
	cartId: number;
}) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const { removeCart } = useCartContext();
	const toast = useToast();
	const handleDelete = async () => {
		setIsUpdating(true);
		const response = await removeCart(cartId);
		if (response.code >= 400) {
			toast(response.message!, MessageType.ERROR);
		}
		setIsUpdating(false);
	};
	return isUpdating ? (
		<Loader strokeWidth={1} size={15} className='animate-spin' />
	) : (
		<button
			onClick={handleDelete}
			type='button'
			title='remove cart item'
			className='underline uppercase text-xs basis-2/12'>
			Remove
		</button>
	);
};

export default RemoveCartButton;
