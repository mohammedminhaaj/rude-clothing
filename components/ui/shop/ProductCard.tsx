import { createClient } from '@/lib/supabase/server';
import { ProductListType } from '@/lib/types';
import Image from 'next/image';

const ProductCard: React.FC<{ product: ProductListType }> = ({
	product,
}: {
	product: ProductListType;
}) => {
	const supabase = createClient();
	const { data: imageURL } = supabase.storage
		.from('images')
		.getPublicUrl(product.product_image[0].image_path);

	return (
		<div className='h-72 sm:h-80 flex justify-end flex-col items-center'>
			<picture className='relative group/product-image h-full w-full overflow-hidden'>
				<Image
					src={imageURL.publicUrl}
					alt={`image of ${product.name}`}
					style={{
						objectFit: 'cover',
						objectPosition: 'center',
					}}
					fill
					className='group-hover/product-image:scale-110 transition-all duration-300'
				/>
				{product.on_sale && (
					<p className='uppercase absolute top-2 text-white bg-slate-700 rounded-lg px-2 py-1 left-2 shadow-md text-xs'>
						Sale
					</p>
				)}
				{product.available_quantity <= 0 && (
					<p className='uppercase absolute top-2 text-white bg-slate-700 rounded-lg px-2 py-1 left-2 shadow-md text-xs'>
						Out of Stock
					</p>
				)}
			</picture>

			<button className='w-full text-xs text-white bg-slate-700 hover:bg-slate-800 transition-colors duration-300 p-2 md:p-4 uppercase'>
				Quick Add
			</button>
			<div className='mt-5 space-y-2'>
				<h2 className='font-extrabold text-sm uppercase text-center line-clamp-1'>
					{product.name}
				</h2>
				<div className='flex gap-2 items-center justify-center text-xs flex-wrap'>
					<h3 className='font-bold'>
						Rs. {product.price.toFixed(2)}
					</h3>
					<h3 className='font-extralight line-through'>
						Rs. {product.original_price.toFixed(2)}
					</h3>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
