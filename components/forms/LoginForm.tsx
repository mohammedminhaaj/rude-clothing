'use client';

import { loginUser } from '@/actions/auth';
import useToast from '@/hooks/useToast';
import { IFormResponse } from '@/lib/types';
import { MessageType } from '@/store/MessageProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthSubmitButton from '../ui/AuthSubmitButton';
import { useCartContext } from '@/store/CartProvider';

export type LoginFormInput = {
	email: string;
	password: string;
};

const LoginForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<LoginFormInput>();

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const toast = useToast();

	const { push } = useRouter();

	const searchParams = useSearchParams();

	const { appendCart } = useCartContext();

	const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
		try {
			setIsSubmitting(true);
			const response: IFormResponse = await loginUser(
				data.email,
				data.password
			);

			if (response.code === 409) {
				toast(response.message, MessageType.INFO);
				push('/');
			} else if (response.code === 200) {
				toast(response.message);
				const redirectTo: string | null = searchParams.get('next');
				await appendCart(response.payload.anonUserId)
				push(redirectTo ?? '/');
			} else {
				toast(response.message, MessageType.ERROR);
				reset({
					password: '',
				});
			}
		} catch {
			toast(
				'Something went wrong. Please refresh and try again',
				MessageType.ERROR
			);
			reset({
				password: '',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
			<div className='relative'>
				<input
					id='email-field'
					required
					{...register('email', {
						required: 'This field is required',
						pattern: {
							value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
							message: 'Please enter a valid email',
						},
					})}
					className={`floating-input peer ${errors.email && 'error'}`}
					title='Email'
					type='text'
				/>
				<label
					className={`floating-label  ${errors.email && 'error'}`}
					htmlFor='email-field'>
					Email
				</label>
			</div>
			{errors.email && (
				<p className='text-xs text-red-500'>{errors.email.message}</p>
			)}
			<div className='relative'>
				<input
					id='password-field'
					required
					{...register('password', {
						required: 'This field is required',
						minLength: {
							value: 6,
							message:
								'Password should contain atleast 6 characters',
						},
					})}
					className={`floating-input peer ${
						errors.password && 'error'
					}`}
					title='Password'
					type='password'
				/>
				<label
					htmlFor='password-field'
					className={`floating-label  ${errors.password && 'error'}`}>
					Password
				</label>
			</div>
			{errors.password && (
				<p className='text-xs text-red-500'>
					{errors.password.message}
				</p>
			)}
			<AuthSubmitButton
				isSubmitting={isSubmitting}
				text={'Sign In'}
				textWhenSubmitting={'Logging In'}
			/>
		</form>
	);
};

export default LoginForm;
