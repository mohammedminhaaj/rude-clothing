'use client';

import RefreshButton from '@/components/ui/RefreshButton';

const TagError = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	return (
		<div className='flex justify-between items-center flex-col gap-2'>
			<h2 className='text-center'>Failed to load the filters</h2>
			<RefreshButton reset={reset} />
		</div>
	);
};

export default TagError;
