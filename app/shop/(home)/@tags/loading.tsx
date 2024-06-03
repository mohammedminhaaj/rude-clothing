export default function TagLoading() {
	const skeleton: JSX.Element[] = [];
	for (let i = 1; i <= 5; i++) {
		skeleton.push(
			<ul key={i} className='animate-pulse flex p-10 flex-col gap-2'>
				<li className='bg-gray-300 h-3 rounded w-16'></li>
				<li className='bg-gray-300 h-2 rounded w-10'></li>
				<li className='bg-gray-300 h-2 rounded w-10'></li>
				<li className='bg-gray-300 h-2 rounded w-10'></li>
				<li className='bg-gray-300 h-2 rounded w-10'></li>
			</ul>
		);
	}

	return <div className='col-span-3'>{skeleton}</div>;
}
