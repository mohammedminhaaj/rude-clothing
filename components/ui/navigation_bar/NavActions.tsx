import SearchAction from './SearchAction';
import { getUser } from '@/actions/auth';
import UserAction from './UserAction';
import CartAction from './CartAction';
import { getCartData } from '@/actions/cart';

const NavActions: React.FC = async () => {
	const { user } = await getUser();

	const cart = await getCartData(user);

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
