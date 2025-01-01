import useToast from '@/hooks/useToast';
import { MessageType } from '@/store/MessageProvider';
import { useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
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

    const buttonText = () => {
        if (isOutOfStock) return 'Notify Me';

        if (isLoading)
            return <Loader2 className='animate-spin text-white stroke-1' />;

        return 'Add to Cart';
    };

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
        // TODO: Implement Notify Me functionality
        setIsLoading(true);
    };

    return (
        <button
            disabled={isDisabled || isLoading}
            onClick={isOutOfStock ? handleNotifyMe : handleAddToCart}
            className='primary-button'
        >
            {buttonText()}
        </button>
    );
};

export default AddToCart;
