import Link from 'next/link';
import { RefreshCw } from 'react-feather';

const Offers: React.FC = () => (
	<section className='flex justify-center gap-3 sm:gap-5 items-center text-white bg-slate-900 text-sm p-2'>
		<h3>10% Off on all online orders</h3>
		<button type='button' title='next offer'>
			<RefreshCw size={16} />
		</button>
	</section>
);

export default Offers;
