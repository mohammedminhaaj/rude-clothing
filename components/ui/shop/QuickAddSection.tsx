import { ProductIdProp } from '@/lib/types';
import QuickAddSectionSkeleton from './QuickAddSectionSkeleton';
import { useEffect, useState } from 'react';
import { getSingleProduct } from '@/actions/shop';
import ImageCarousel from './ImageCarousel';
import { createClient } from '@/lib/supabase/client';
import QuickAddProductDetails from './QuickAddProductDetails';

export type SingleProductTag = {
    id: number;
    name: string;
};

export type SingleProductType =
    | {
          name: string;
          description: string;
          price: string;
          originalPrice: string;
          availableQuantity: number;
          onSale: boolean;
          productImages: string[];
          availableSizes: SingleProductTag[];
      }
    | undefined;

type ProductState = {
    isLoading: boolean;
    product: SingleProductType;
};

type QuickAddSectionProp = ProductIdProp & {
    handleToggleSidebar: () => void;
};

const QuickAddSection: React.FC<QuickAddSectionProp> = ({
    productId,
    handleToggleSidebar,
}: QuickAddSectionProp) => {
    const [{ isLoading, product }, setProductState] = useState<ProductState>({
        isLoading: true,
        product: undefined,
    });

    useEffect(() => {
        (async () => {
            const [singleProduct] = await getSingleProduct(productId);
            setProductState((prev) => ({
                ...prev,
                isLoading: false,
                product: singleProduct,
            }));
        })();
    }, []);

    const supabase = createClient();

    const productImages: string[] = [];

    if (product) {
        product.productImages.forEach((item) =>
            productImages.push(
                supabase.storage.from('images').getPublicUrl(item).data
                    .publicUrl
            )
        );
    }

    if (isLoading) return <QuickAddSectionSkeleton />;

    if (!product)
        return (
            <section className='flex items-center justify-center gap-2 h-full flex-col p-5 text-center'>
                <h2 className='text-5xl font-bold'>Oops!</h2>
                <h3>
                    We couldn't locate the product. Please refresh and try
                    again.
                </h3>
            </section>
        );

    return (
        <section className='flex flex-col h-screen'>
            <section className='w-full h-1/2 relative'>
                <ImageCarousel images={productImages} />
            </section>
            <QuickAddProductDetails
                {...{
                    id: productId,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    availableSizes: product.availableSizes,
                    availableQuantity: product.availableQuantity,
                    onSale: product.onSale,
                    productImage: productImages[0],
                    handleToggleSidebar: handleToggleSidebar,
                }}
            />
        </section>
    );
};

export default QuickAddSection;
