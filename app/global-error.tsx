'use client';

import RefreshButton from '@/components/ui/RefreshButton';
import { RefreshCw } from 'react-feather';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body className='min-h-screen w-full flex justify-center items-center flex-col gap-5'>
				<h2 className='text-3xl font-bold'>Oops!</h2>
				<h3>Something went wrong!</h3>
				<RefreshButton reset={reset} />
			</body>
		</html>
	);
}
