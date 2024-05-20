import { Child } from '@/lib/types';
import { motion } from 'framer-motion';

const Overlay: React.FC<Child> = ({ children }: Child) => (
	<motion.section
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className='h-screen w-screen backdrop-blur-sm backdrop-brightness-75 fixed z-10'>
		{children}
	</motion.section>
);

export default Overlay;
