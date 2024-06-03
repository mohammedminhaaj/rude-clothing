import { Child } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Shop | Rude Clothing',
};

const ShopLayout: React.FC<Child> = ({ children }: Child) => {
	return <main>{children}</main>;
};

export default ShopLayout;
