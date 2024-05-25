import { Metadata } from 'next';

import LoginForm from '@/components/forms/LoginForm';
import { libre } from '@/app/layout';
import AnimatedLink from '@/components/ui/AnimatedLink';

export const metadata: Metadata = {
	title: 'Rude Clothing | Login',
};

const Login: React.FC = () => {
	return (
		<>
			<h1
				className={`${libre.className} text-center text-3xl font-extrabold uppercase`}>
				Login
			</h1>
			<h2 className='text-center text-sm font-extralight'>
				Please login using your credentials
			</h2>
			<LoginForm />
			<p className='text-xs text-center'>
				<AnimatedLink href='/forgot-password' text='Forgot Password?' />
			</p>
			<p className='text-xs text-center'>
				Don't have an account?
				<AnimatedLink href='/sign-up' text='Sign up' />
			</p>
		</>
	);
};

export default Login;
