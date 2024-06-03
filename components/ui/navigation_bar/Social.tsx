import { Instagram } from 'react-feather';

const Social: React.FC = () => (
	<ul className='flex gap-2 items-center'>
		<li>
			<Instagram
				className='transition-all hover:scale-110 duration-300'
				strokeWidth={1}
			/>
		</li>
	</ul>
);

export default Social;
