import { CheckoutProvider } from '@/store/CheckoutProvider';
import CheckoutStepCard from './CheckoutStepCard';
import ContactInformation from './ContactInformation';
import ShippingInformation from './ShippingInformation';
import PaymentInformation from './PaymentInformation';

const CheckoutSteps: React.FC = () => {
    return (
        <CheckoutProvider>
            <div className='space-y-5'>
                <ContactInformation />
                <ShippingInformation />
                <PaymentInformation />
            </div>
        </CheckoutProvider>
    );
};

export default CheckoutSteps;
