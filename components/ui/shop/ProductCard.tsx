import { createClient } from '@/lib/supabase/server';
import { ProductListType } from '@/lib/types';
import Image from 'next/image';
import QuickAdd from './QuickAdd';
import Link from 'next/link';

const ProductCard: React.FC<{ product: ProductListType }> = ({
    product,
}: {
    product: ProductListType;
}) => {
    const supabase = createClient();
    const { data: imageURL } = supabase.storage
        .from('images')
        .getPublicUrl(product.productImage);

    return (
        <div className='h-72 sm:h-80 flex justify-end flex-col items-center'>
            <Link
                href={`/shop/${product.id}`}
                className='h-full w-full relative group/product-image overflow-hidden'
            >
                <figure>
                    <Image
                        src={imageURL.publicUrl}
                        alt={`image of ${product.name}`}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        fill
                        className='group-hover/product-image:scale-110 transition-all duration-300'
                    />
                    {product.onSale && (
                        <p className='uppercase absolute top-2 text-white bg-slate-700 rounded px-2 py-1 left-2 shadow-md text-xs'>
                            Sale
                        </p>
                    )}
                    {product.availableQuantity <= 0 && (
                        <p className='uppercase absolute top-2 text-white bg-slate-700 rounded px-2 py-1 left-2 shadow-md text-xs'>
                            Out of Stock
                        </p>
                    )}
                </figure>
            </Link>

            <QuickAdd productId={product.id} />
            <div className='mt-5 space-y-2'>
                <Link href={`/shop/${product.id}`}>
                    <h2 className='font-extrabold text-sm uppercase text-center line-clamp-1'>
                        {product.name}
                    </h2>
                </Link>

                <div className='flex gap-2 items-center justify-center text-xs flex-wrap'>
                    <h3 className='font-bold'>INR {product.price}</h3>
                    <h3 className='font-extralight line-through'>
                        INR {product.originalPrice}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
