import CheckoutStepCard from './CheckoutStepCard';

const PaymentInformation: React.FC = () => {
    return (
        <CheckoutStepCard step={3} heading='Payment Method'>
            <div>Payment Method</div>
        </CheckoutStepCard>
    );
};

export default PaymentInformation;
