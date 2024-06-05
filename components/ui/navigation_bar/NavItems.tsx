'use client';

import { animatedItem, animatedList } from '@/lib/variants';
import { motion } from 'framer-motion';

const NavItems: React.FC = () => (
	<motion.ul
		initial='hidden'
		animate='visible'
		variants={animatedList}
		className='flex flex-col md:flex-row gap-5 items-start md:items-center justify-center uppercase md:text-sm w-full cursor-default'>
		<motion.li variants={animatedItem} className='text-red-500 group'>
			<p>Sale</p>
			<span className='transition-all duration-300 h-0.5 bg-red-500 max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={animatedItem} className='group'>
			<p>New Arrivals</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={animatedItem} className='group'>
			<p>Clothing</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={animatedItem} className='group'>
			<p>About</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
	</motion.ul>
);

export default NavItems;
