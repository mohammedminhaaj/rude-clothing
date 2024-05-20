'use client';

import { motion } from 'framer-motion';

const list = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: 'beforeChildren',
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const NavItems: React.FC = () => (
	<motion.ul
		initial='hidden'
		animate='visible'
		variants={list}
		className='flex flex-col md:flex-row gap-5 items-start md:items-center justify-center uppercase md:text-sm w-full cursor-default'>
		<motion.li variants={item} className='text-red-500 group'>
			<p>Sale</p>
			<span className='transition-all duration-300 h-0.5 bg-red-500 max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={item} className='group'>
			<p>New Arrivals</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={item} className='group'>
			<p>Clothing</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
		<motion.li variants={item} className='group'>
			<p>About</p>
			<span className='transition-all duration-300 h-0.5 bg-black max-w-0 group-hover:max-w-full block'></span>
		</motion.li>
	</motion.ul>
);

export default NavItems;
