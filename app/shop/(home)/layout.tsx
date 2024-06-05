import { Child } from '@/lib/types';

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
		<>
			{children}
			<div className='grid grid-cols-12 group'>
				{tags}
				{products}
			</div>
		</>
	);
};

export default ShopLayout;
