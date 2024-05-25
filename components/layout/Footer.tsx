import { libre } from '@/app/layout';
import { Check, DollarSign, Mail, MessageSquare } from 'react-feather';
import AnimatedLink from '../ui/AnimatedLink';

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	return (
		<section className='text-white bg-slate-900 p-10'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-center'>
				<div className='flex flex-col gap-3 items-center justify-start'>
					<DollarSign />
					<p className='uppercase font-extrabold text-xl'>
						Secure Transactions
					</p>
					<p>
						Transactions are handled with very much care and
						security.
					</p>
				</div>
				<div className='flex flex-col gap-3 items-center justify-start'>
					<Check />
					<p className='uppercase font-extrabold text-xl'>
						Simple Checkout
					</p>
					<p>Our secure checkout is quick and easy to use.</p>
				</div>
				<div className='flex flex-col gap-3 items-center justify-start'>
					<MessageSquare />
					<p className='uppercase font-extrabold text-xl'>
						Get in Touch
					</p>
					<p>Have questions? Get in touch with us at any time.</p>
				</div>
			</div>
			<hr className='my-20' />
			<div className='grid grid-cols-1 gap-10 sm:grid-cols-2 divide-y sm:divide-x sm:divide-y-0'>
				<div className='space-y-5'>
					<h3 className='text-2xl uppercase font-extrabold'>
						Subscribe to Newsletter
					</h3>
					<p>
						Subscribe to get special offers, and once-in-a-lifetime
						deals.
					</p>
					<form className='flex flex-wrap gap-5'>
						<input
							type='email'
							placeholder='Email Address'
							className='border border-white bg-transparent px-2 py-1 rounded-lg w-full md:w-fit'
						/>
						<button className='bg-white text-black transition-colors duration-300 hover:bg-transparent hover:text-white rounded-lg px-2 py-1 flex gap-1 items-center'>
							Subscribe
							<Mail size={16} strokeWidth={1} />
						</button>
					</form>
				</div>
				<div className='flex gap-5 flex-col sm:pl-10 pt-10 sm:pt-0'>
					<h3 className='text-2xl uppercase font-extrabold'>
						Company
					</h3>
					<AnimatedLink text='FAQ' color='white' />
					<AnimatedLink text='Blog' color='white' />
				</div>
			</div>
			<hr className='my-20' />
			<ul className='flex gap-3 flex-wrap justify-end items-center my-2'>
				<li>&#169; Rude Clothing {currentYear}</li>
				<li>
					<AnimatedLink text='Shipping Policy' color='white' />
				</li>
				<li>
					<AnimatedLink text='Refund Policy' color='white' />
				</li>
				<li>
					<AnimatedLink text='Privacy Policy' color='white' />
				</li>
				<li>
					<AnimatedLink text='Terms of Service' color='white' />
				</li>
				<li>
					
				</li>
			</ul>

			<h2
				className={`text-center font-extrabold text-6xl sm:text-9xl opacity-10 ${libre.className}`}>
				RUDE
			</h2>
		</section>
	);
};

export default Footer;
