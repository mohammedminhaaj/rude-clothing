import Link from 'next/link';
import { Metadata } from 'next';
import PasswordResetForm from '@/components/forms/PasswordResetForm';
import { libre } from '@/app/layout';
import AnimatedLink from '@/components/ui/AnimatedLink';

export const metadata: Metadata = {
	title: 'Rude Clothing | Forgot Password',
};

const ForgotPassword: React.FC = () => {
	return (
		<>
			<h1
				className={`${libre.className} text-center text-3xl font-extrabold uppercase`}>
				Forgot Password
			</h1>
			<h2 className='text-center text-sm font-extralight'>
				Please enter your email address
			</h2>
			<PasswordResetForm />
			<p className='text-xs text-center'>
				<AnimatedLink text='Go back' href='/login' />
			</p>
		</>
	);
};

export default ForgotPassword;
