'use client';

import { useCartContext } from '@/store/CartProvider';
import { Info, Tag, X } from 'lucide-react';

type CouponBannerProps = {
    code: string;
    description: string;
};

const CouponBanner: React.FC<CouponBannerProps> = ({
    code,
    description,
}: CouponBannerProps) => {
    const { removeCoupon, couponErrors } = useCartContext();
    const { errorText, hasError } = couponErrors();

    return (
        <div
            className={`mt-5 p-5 border flex gap-5 items-center justify-between rounded ${
                hasError ? 'bg-red-50' : 'bg-green-50'
            }`}
        >
            <div className='w-full flex gap-5 items-center'>
                {hasError ? (
                    <Info className='stroke-1 flex-shrink-0' />
                ) : (
                    <Tag className='stroke-1 flex-shrink-0' />
                )}

                <section>
                    <h3 className='font-semibold text-sm'>{code}</h3>
                    <h4 className='font-light text-xs'>
                        {hasError ? errorText : description}
                    </h4>
                </section>
            </div>
            <button onClick={removeCoupon}>
                <X className='stroke-1' />
            </button>
        </div>
    );
};

export default CouponBanner;
