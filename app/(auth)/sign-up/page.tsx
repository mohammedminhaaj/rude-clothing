import Link from 'next/link';
import { Metadata } from 'next';
import SignUpForm from '@/components/forms/SignUpForm';
import { libre } from '@/app/layout';
import AnimatedLink from '@/components/ui/AnimatedLink';

export const metadata: Metadata = {
	title: 'Rude Clothing | Create Account',
};

const SignUp: React.FC = () => {
	return (
		<>
			<h1
				className={`${libre.className} text-center text-3xl font-extrabold uppercase`}>
				Create Account
			</h1>
			<h2 className='text-center text-sm font-extralight'>
				Please enter the following details
			</h2>
			<SignUpForm />
			<p className='text-xs text-center'>
				Already have an account?
				<AnimatedLink href='/login' text='Log in' />
			</p>
		</>
	);
};

export default SignUp;
