import { Child } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout | Rude Clothing',
};

const CheckoutLayout: React.FC<Readonly<Child>> = ({
    children,
}: Readonly<Child>) => {
    return (
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 p-10'>
            {children}
        </div>
    );
};

export default CheckoutLayout;
