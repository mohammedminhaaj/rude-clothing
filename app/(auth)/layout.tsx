import { Child } from '@/lib/types';

const AuthLayout: React.FC<Readonly<Child>> = ({
	children,
}: Readonly<Child>) => {
	return (
		<div className='flex gap-5 justify-center items-center p-10'>
			<div className='flex flex-col gap-5 w-full sm:w-3/4 md:w-2/4 lg:1/4'>
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
