const QuickAddSectionSkeleton: React.FC = () => (
	<section className='flex flex-col h-screen'>
		<div className='bg-gray-300 w-full h-1/2 animate-pulse'></div>
        <section className='p-5 flex flex-col gap-5'>
            <div className="h-6 w-1/2 animate-pulse bg-gray-300"></div>
            <div className="h-6 w-1/4 animate-pulse bg-gray-300"></div>
            <div className="h-28 animate-pulse bg-gray-300"></div>
        </section>
	</section>
);

export default QuickAddSectionSkeleton;
