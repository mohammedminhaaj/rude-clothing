import { Child } from '@/lib/types';
import type { Metadata } from 'next';
import { ChevronDown, Filter } from 'react-feather';

export const metadata: Metadata = {
	title: 'Rude Clothing | Shop',
};

type ShopLayoutProps = Child & {
	tags: React.ReactNode;
	products: React.ReactNode;
};

const ShopLayout: React.FC<ShopLayoutProps> = ({
	children,
	tags,
	products,
}: ShopLayoutProps) => {
	return (
		<main>
			{children}
			<div className='grid grid-cols-12 group'>
				{tags}
				{products}
			</div>
		</main>
	);
};

export default ShopLayout;
