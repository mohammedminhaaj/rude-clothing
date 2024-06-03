import { ProductIdProp } from '@/lib/types';
import QuickAddSectionSkeleton from './QuickAddSectionSkeleton';
import { useEffect, useState } from 'react';
import { getSingleProduct } from '@/actions/shop';
import ImageCarousel from './ImageCarousel';
import { createClient } from '@/lib/supabase/client';
import QuickAddProductDetails from './QuickAddProductDetails';

export type SingleProductTag = {
	id: number;
	tag: {
		name: string;
		tagMaster: {
			name: string;
		};
	};
};

export type SingleProductType =
	| {
			name: string;
			description: string;
			price: string;
			originalPrice: string;
			availableQuantity: number;
			onSale: boolean;
			productImages: {
				imagePath: string;
			}[];
			tags: SingleProductTag[];
	  }
	| undefined;

type ProductState = {
	isLoading: boolean;
	product: SingleProductType;
};

const QuickAddSection: React.FC<ProductIdProp> = ({
	productId,
}: ProductIdProp) => {
	const [{ isLoading, product }, setProductState] = useState<ProductState>({
		isLoading: true,
		product: undefined,
	});

	useEffect(() => {
		(async () => {
			const singleProduct = await getSingleProduct(productId);
			setProductState((prev) => ({
				...prev,
				isLoading: false,
				product: singleProduct,
			}));
		})();
	}, []);

	const supabase = createClient();

	const availableSizes: SingleProductTag[] = [];
	const productImages: string[] = [];

	if (product) {
		product.tags.map((item) => {
			item.tag.tagMaster.name === 'size' && availableSizes.push(item);
		});
		product.productImages.map((item) =>
			productImages.push(
				supabase.storage.from('images').getPublicUrl(item.imagePath)
					.data.publicUrl
			)
		);
	}

	return isLoading ? (
		<QuickAddSectionSkeleton />
	) : !product ? (
		<section className='flex items-center justify-center gap-2 h-full flex-col p-5 text-center'>
			<h2 className='text-5xl font-bold'>Oops!</h2>
			<h3>
				We couldn't locate the product. Please refresh and try again.
			</h3>
		</section>
	) : (
		<section className='flex flex-col h-screen'>
			<section className='w-full h-1/2 relative'>
				<ImageCarousel images={productImages} />
			</section>
			<QuickAddProductDetails
				{...{
					name: product.name,
					description: product.description,
					price: product.price,
					originalPrice: product.originalPrice,
					availableSizes: availableSizes,
					availableQuantity: product.availableQuantity,
					onSale: product.onSale,
				}}
			/>
		</section>
	);
};

export default QuickAddSection;
