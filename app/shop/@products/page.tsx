import { getProducts } from '@/actions/shop';
import AdCard from '@/components/ui/shop/AdCard';
import Pagination from '@/components/ui/shop/Pagination';
import ProductCard from '@/components/ui/shop/ProductCard';
import { SearchParamType } from '@/lib/types';

type ProductSectionType = {
	searchParams: SearchParamType;
};

const ProductSection: React.FC<ProductSectionType> = async ({
	searchParams,
}: ProductSectionType) => {
	const { data: products, count } = await getProducts(searchParams);
	const ads: JSX.Element[] = [
		<AdCard key={'ad-key1'} />,
		<AdCard key={'ad-key2'} />,
		<AdCard key={'ad-key3'} />,
	];
	let randomState: number = 0;
	return products?.length === 0 ? (
		<section className='group-has-[.filter-column]:md:col-span-9 col-span-full p-5 md:p-10 flex items-center justify-center flex-col'>
			<h2 className='text-2xl'>Oops!</h2>
			<h3 className='font-extralight'>
				We couldn't find any products for you at the moment
			</h3>
		</section>
	) : (
		<>
			<section className='group-has-[.filter-column]:md:col-span-9 col-span-full p-5 md:p-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
				{products!
					.map((item, index) => {
						if ([0, 5, 9].includes(index)) {
							const currentAd = ads[randomState];
							randomState !== ads.length - 1
								? randomState++
								: (randomState = 0);
							return [
								currentAd,
								<ProductCard key={item.id} product={item} />,
							];
						}
						return <ProductCard key={item.id} product={item} />;
					})
					.flat()}
				<section className='col-span-full'>
					<Pagination totalRecords={count ?? 0} />
				</section>
			</section>
		</>
	);
};

export default ProductSection;
