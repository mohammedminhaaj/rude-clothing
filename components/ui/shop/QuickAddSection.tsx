import { ProductIdProp } from '@/lib/types';
import QuickAddSectionSkeleton from './QuickAddSectionSkeleton';
import { useEffect, useState } from 'react';
import { getSingleProduct } from '@/actions/shop';
import SizeInputSection from './SizeInputSection';
import ImageCarousel from './ImageCarousel';
import { createClient } from '@/lib/supabase/client';

export type SingleProductTag = {
	id: number;
	tag: {
		name: string;
		tagMaster: {
			name: string;
		};
	};
};

type SingleProductType =
	| {
			name: string;
			description: string;
			price: string;
			originalPrice: string;
			availableQuantity: number;
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
			<section className='p-5 pb-10 flex flex-col gap-5 overflow-y-auto'>
				<h2 className='text-2xl font-bold uppercase'>{product.name}</h2>
				<div className='flex gap-3'>
					<h3>Rs. {product.price}</h3>
					<h3 className='line-through font-extralight'>
						Rs. {product.originalPrice}
					</h3>
				</div>
				<SizeInputSection sizeTags={availableSizes} />
				<p>{product.description}</p>
			</section>
			<section className='sticky bottom-0 px-5 py-2 w-full bg-white top-white-shadow'>
				<button className='font-bold uppercase w-full p-2 rounded bg-slate-600 hover:bg-slate-800 text-white transition-colors duration-300'>
					{product.availableQuantity <= 0
						? 'Notify Me'
						: 'Add to Cart'}
				</button>
			</section>
		</section>
	);
};

export default QuickAddSection;
