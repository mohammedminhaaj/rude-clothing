'use client';

import { useCartContext } from '@/store/CartProvider';

type PriceGroupProps = {
    heading: string;
    value: string;
    bold?: boolean;
};

const PriceGroup: React.FC<PriceGroupProps> = ({
    heading,
    value,
    bold,
}: PriceGroupProps) => (
    <li
        className={`flex justify-between ${
            bold ? 'font-bold' : 'text-sm'
        } items-center `}
    >
        <h3>{heading}</h3>
        <h4>{value}</h4>
    </li>
);

const CheckoutCartTotal: React.FC = () => {
    const { getTotal, getSubTotal, getCouponDiscount } = useCartContext();
    return (
        <ul className='space-y-3 pt-5'>
            <PriceGroup
                heading='Subtotal'
                value={`INR ${getSubTotal().toFixed(2)}`}
            />
            {getCouponDiscount() && (
                <PriceGroup
                    heading='Discount'
                    value={`- INR ${getCouponDiscount()!.toFixed(2)}`}
                />
            )}
            <PriceGroup
                heading='Total'
                value={`INR ${getTotal().toFixed(2)}`}
                bold
            />
        </ul>
    );
};

export default CheckoutCartTotal;
