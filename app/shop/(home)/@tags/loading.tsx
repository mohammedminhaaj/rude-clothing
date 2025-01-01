import Skeleton from '@/components/ui/Skeleton';

const TagLoading: React.FC = () => (
    <div className='col-span-3'>
        {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className='p-10 space-y-2'>
                <Skeleton className='h-3 w-16' />
                <Skeleton className='h-2 w-10' />
                <Skeleton className='h-2 w-10' />
                <Skeleton className='h-2 w-10' />
                <Skeleton className='h-2 w-10' />
            </div>
        ))}
    </div>
);

export default TagLoading;
