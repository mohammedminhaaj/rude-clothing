import { Loader } from 'react-feather';

type AuthSubmitButtonProps = {
	isSubmitting: boolean;
	text: string;
	textWhenSubmitting: string;
};

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
	isSubmitting,
	text,
	textWhenSubmitting,
}: AuthSubmitButtonProps) => (
	<button
		title={text}
		type='submit'
		disabled={isSubmitting}
		className='px-4 py-2 bg-slate-700 transition-colors hover:bg-slate-800 duration-300 focus:outline-slate-800 disabled:bg-gray-400 disabled:hover:bg-gray-500 text-white rounded font-extrabold'>
		{isSubmitting ? (
			<span className='grid grid-cols-4 w-fit gap-2 mx-auto'>
				<Loader className='col-span-1 animate-spin' />
				<p className='col-span-3'>{textWhenSubmitting}</p>
			</span>
		) : (
			text
		)}
	</button>
);

export default AuthSubmitButton;
