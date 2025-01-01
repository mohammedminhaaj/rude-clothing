import CheckoutCart from '@/components/ui/checkout/CheckoutCart';
import CheckoutSteps from '@/components/ui/checkout/CheckoutSteps';

const CheckoutPage: React.FC = () => {
    return (
        <>
            <section className='md:order-1 order-2'>
                <CheckoutSteps />
            </section>
            <section className='md:order-2 order-1 shadow-md p-5'>
                <CheckoutCart />
            </section>
        </>
    );
};

export default CheckoutPage;
