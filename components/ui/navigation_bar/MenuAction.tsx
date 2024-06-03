'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'react-feather';
import Overlay from '../Overlay';
import NavItems from './NavItems';
import Social from './Social';

type MenuSidebarProps = {
	toggleMenuSidebar: () => void;
};

const MenuSidebar: React.FC<MenuSidebarProps> = ({
	toggleMenuSidebar,
}: MenuSidebarProps) => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				toggleMenuSidebar();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	});
	return createPortal(
		<Overlay>
			<motion.aside
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				transition={{ bounce: 0 }}
				ref={sidebarRef}
				className='h-full bg-white w-full sm:w-3/4 md:w-2/4 lg:1/4 flex flex-col justify-between p-5 shadow-2xl'>
				<div className='space-y-5'>
					<header>
						<button
							type='button'
							title='close menu'
							onClick={toggleMenuSidebar}>
							<X className='scale-125 hover:scale-95 transition-all duration-300' strokeWidth={1} />
						</button>
					</header>
					<NavItems />
				</div>
				<Social />
			</motion.aside>
		</Overlay>,
		document.getElementById('overlays')!
	);
};

const MenuAction: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const toggleMenuSidebar = () => {
		setIsOpen((prev: boolean) => !prev);
	};
	return (
		<>
			<button
				type='button'
				title='open menu'
				className=''
				onClick={toggleMenuSidebar}>
				<Menu strokeWidth={1} />
			</button>
			<AnimatePresence>
				{isOpen && (
					<MenuSidebar
						key={'menu-sidebar'}
						toggleMenuSidebar={toggleMenuSidebar}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default MenuAction;
