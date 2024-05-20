import { ShoppingBag, User } from 'react-feather';
import SearchAction from './SearchAction';
import Link from 'next/link';
import { getUser } from '@/actions/auth';
import { createClient } from '@/lib/supabase/server';
import UserAction from './UserAction';

const NavActions: React.FC = async () => {
	const supabase = createClient();
	const { user } = await getUser(supabase);
	return (
		<section className='flex gap-5 basis-1/5 justify-end items-center'>
			<span className='hidden md:flex'>
				<SearchAction />
			</span>
			<UserAction validUser={user && !user.is_anonymous} />
			<button
				type='button'
				title='shopping bag'
				className='transition-all hover:scale-110 duration-300'>
				<ShoppingBag size={20} />
			</button>
		</section>
	);
};

export default NavActions;
