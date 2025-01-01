import Skeleton from '../Skeleton';

const CheckoutCartSkeleton: React.FC = () => (
    <div className='space-y-5'>
        {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className='flex justify-between items-center'>
                <div className='flex gap-3'>
                    <Skeleton className='size-28' />
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-4 w-8' />
                        <Skeleton className='h-4 w-12' />
                        <Skeleton className='h-4 w-12' />
                    </div>
                </div>
                <Skeleton className='h-4 w-20' />
            </div>
        ))}
    </div>
);

export default CheckoutCartSkeleton;
