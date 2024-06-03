import { db } from '@/lib/drizzle/db';
import { Metadata } from 'next';

type ProductDetailsPageProps = {
	params: { productId: string };
};

export async function generateMetadata({
	params: { productId },
}: ProductDetailsPageProps): Promise<Metadata> {
	const product = await db.query.Product.findFirst({
		columns: {
			name: true,
			description: true,
		},
		where: (Product, { eq }) => eq(Product.id, productId),
	});

	return {
		title: product
			? `${product.name} | Rude Clothing`
			: 'Product Details | Rude Clothing',
		description: product
			? product.description
			: 'An amazing product from Rude Clothing',
	};
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = async ({
	params: { productId },
}: ProductDetailsPageProps) => {
	return <>{productId}</>;
};

export default ProductDetailsPage;
