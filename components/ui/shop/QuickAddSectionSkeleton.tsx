import Skeleton from '../Skeleton';

const QuickAddSectionSkeleton: React.FC = () => (
    <section className='flex flex-col h-screen'>
        <Skeleton className='w-full h-1/2' />
        <section className='p-5 flex flex-col gap-5'>
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-28' />
        </section>
    </section>
);

export default QuickAddSectionSkeleton;
