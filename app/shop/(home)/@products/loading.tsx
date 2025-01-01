import Skeleton from '@/components/ui/Skeleton';

const ProductLoading = () => (
    <section className='col-span-9 p-5 md:p-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className='h-72 sm:h-80' />
        ))}
    </section>
);

export default ProductLoading;
