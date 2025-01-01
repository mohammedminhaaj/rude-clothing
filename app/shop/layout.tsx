import { Child } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Shop | Rude Clothing',
};

const ShopLayout: React.FC<Child> = ({ children }: Child) => {
	return <div>{children}</div>;
};

export default ShopLayout;
