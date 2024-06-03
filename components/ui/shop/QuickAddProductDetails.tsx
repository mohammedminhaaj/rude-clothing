import SizeInputSection from './SizeInputSection';
import { motion } from 'framer-motion';
import AddToCart from './AddToCart';
import { SingleProductTag, SingleProductType } from './QuickAddSection';
import { useState } from 'react';

type QuickAddProductDetailsProps = {
	name: string;
	description: string;
	price: string;
	originalPrice: string;
	availableSizes: SingleProductTag[];
	availableQuantity: number;
	onSale: boolean;
};

const QuickAddProductDetails: React.FC<QuickAddProductDetailsProps> = ({
	name,
	description,
	price,
	originalPrice,
	availableSizes,
	availableQuantity,
	onSale,
}: QuickAddProductDetailsProps) => {
	const [productTag, setProductTag] = useState<number | null>(
		availableSizes.length === 0 ? null : availableSizes[0].id
	);

	const updateProductTag = (id: number) => {
		setProductTag(id);
	};

	const salePercentage: number =
		(parseFloat(price) / parseFloat(originalPrice)) * 100;

	return (
		<>
			<section className='p-5 pb-10 flex flex-col gap-5 overflow-y-auto'>
				<motion.h2
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ bounce: false, delay: 0.3 }}
					className='text-2xl font-bold uppercase'>
					{name}
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ bounce: false, delay: 0.4 }}
					className='flex gap-3'>
					<h3>Rs. {price}</h3>
					<h3 className='line-through font-extralight'>
						Rs. {originalPrice}
					</h3>
					{onSale && (
						<h3 className='uppercase font-extralight text-xs text-white bg-slate-700 rounded p-1'>
							{salePercentage.toFixed(0)}% Off
						</h3>
					)}
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ bounce: false, delay: 0.5 }}>
					<SizeInputSection
						availableSizes={availableSizes}
						selectedTag={productTag}
						updateProductTag={updateProductTag}
					/>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ bounce: false, delay: 0.6 }}>
					{description}
				</motion.p>
			</section>
			<section className='sticky bottom-0 px-5 py-2 w-full bg-white top-white-shadow'>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ bounce: false, delay: 0.7 }}>
					<AddToCart
						isOutOfStock={availableQuantity <= 0}
						isDisabled={!productTag}
						selectedTag={productTag}
					/>
				</motion.div>
			</section>
		</>
	);
};

export default QuickAddProductDetails;
