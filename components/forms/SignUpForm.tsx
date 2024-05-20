'use client';

import useToast from '@/hooks/useToast';
import { MessageType } from '@/store/MessageProvider';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { IFormResponse } from '@/lib/types';
import { signupUser } from '@/actions/auth';
import AuthSubmitButton from '../ui/AuthSubmitButton';

export type SignUpFormInput = {
	email: string;
	password: string;
	confirmPassword: string;
};

const SignUpForm: React.FC = () => {
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SignUpFormInput>();

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const toast = useToast();

	const { push } = useRouter();

	const matchPasswords: (value: any) => boolean | string = (value: string) =>
		watch('password') === value || "Passwords don't match";

	const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
		try {
			setIsSubmitting(true);
			const response: IFormResponse = await signupUser(
				data.email,
				data.password
			);
			if (response.code === 409) {
				toast(response.message, MessageType.INFO);
				push('/');
			} else if (response.code === 200) {
				toast(response.message);
				push('/');
			} else {
				toast(response.message, MessageType.ERROR);
				reset({
					password: '',
					confirmPassword: '',
				});
			}
		} catch {
			toast(
				'Something went wrong. Please refresh and try again',
				MessageType.ERROR
			);
			reset({
				password: '',
				confirmPassword: '',
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
					className={`floating-label ${errors.email && 'error'}`}
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
					className={`floating-label ${errors.password && 'error'}`}>
					Password
				</label>
			</div>
			{errors.password && (
				<p className='text-xs text-red-500'>
					{errors.password.message}
				</p>
			)}
			<div className='relative'>
				<input
					id='confirm-password-field'
					required
					{...register('confirmPassword', {
						required: 'This field is required',
						minLength: {
							value: 6,
							message:
								'Confirm password should contain atleast 6 characters',
						},
						validate: matchPasswords,
					})}
					className={`floating-input peer ${
						errors.confirmPassword && 'error'
					}`}
					title='Confirm Password'
					type='password'
				/>
				<label
					htmlFor='confirm-password-field'
					className={`floating-label ${
						errors.confirmPassword && 'error'
					}`}>
					Confirm Password
				</label>
			</div>
			{errors.confirmPassword && (
				<p className='text-xs text-red-500'>
					{errors.confirmPassword.message}
				</p>
			)}

			<AuthSubmitButton
				isSubmitting={isSubmitting}
				text={'Create Account'}
				textWhenSubmitting={'Creating Account'}
			/>
		</form>
	);
};

export default SignUpForm;
