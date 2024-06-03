'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'react-feather';

const UserAction: React.FC<{ validUser: boolean | null }> = ({
	validUser,
}: {
	validUser: boolean | null;
}) => {
	const pathname = usePathname();
	const authPath: string[] = ['/login', '/sign-up', '/forgot-password'];
	return (
		<Link
			href={
				validUser
					? '/profile'
					: `/login?next=${
							authPath.includes(pathname) ? '/' : pathname
					  }`
			}
			type='button'
			title='user'
			className='transition-all hover:scale-110 duration-300'>
			<User strokeWidth={1} />
		</Link>
	);
};

export default UserAction;
