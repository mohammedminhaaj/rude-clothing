import { ShoppingBag } from 'react-feather';
import SearchAction from './SearchAction';
import { getUser } from '@/actions/auth';
import { createClient } from '@/lib/supabase/server';
import UserAction from './UserAction';
import { db } from '@/lib/drizzle/db';
import CartAction from './CartAction';

const NavActions: React.FC = async () => {
	const supabase = createClient();
	const { user } = await getUser(supabase);
	const cart = await db.query.Cart.findMany({
		columns: {
			id: true,
			quantity: true,
		},
		with: {
			productTag: {
				columns: {
					id: true,
				},
				with: {
					product: {
						columns: {
							id: true,
							name: true,
							price: true,
						},
						with: {
							productImages: {
								columns: {
									imagePath: true,
								},
								limit: 1,
							},
						},
					},
					tag: {
						columns: {
							name: true,
						},
					},
				},
			},
		},
	});

	cart.map((cartItem) => {
		cartItem.productTag.product.productImages =
			cartItem.productTag.product.productImages.map((cartImage) => {
				const { data: imageURL } = supabase.storage
					.from('images')
					.getPublicUrl(cartImage.imagePath);
				return { imagePath: imageURL.publicUrl };
			});
	});

	return (
		<section className='flex gap-5 basis-1/5 justify-end items-center'>
			<span className='hidden md:flex'>
				<SearchAction />
			</span>
			<UserAction validUser={user && !user.is_anonymous} />
			<CartAction data={cart} />
		</section>
	);
};

export default NavActions;
