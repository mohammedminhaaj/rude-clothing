'use client';

import RefreshButton from '@/components/ui/RefreshButton';

const ProductError = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	return (
		<div className='group-has-[.filter-column]:md:col-span-9 col-span-full p-5 md:p-10'>
			<div className='flex justify-between items-center flex-col gap-2'>
				<h2 className='text-center'>Failed to load the products</h2>
				<RefreshButton reset={reset} />
			</div>
		</div>
	);
};

export default ProductError;
