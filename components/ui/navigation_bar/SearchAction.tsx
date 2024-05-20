'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'react-feather';
import Overlay from '../Overlay';

type SearchActionPopUpType = {
	toggleSearchBar: () => void;
};

const SearchActionPopUp: React.FC<SearchActionPopUpType> = ({
	toggleSearchBar,
}: SearchActionPopUpType) => {
	const searchRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				toggleSearchBar();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	return createPortal(
		<Overlay>
			<motion.div
				initial={{ opacity: 0, y: -100 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -100 }}
				transition={{ bounce: 0 }}
				ref={searchRef}
				className='h-20 bg-white w-full p-5'>
				<div className='w-full flex gap-2 items-center'>
					<Search />
					<input
						placeholder='Search'
						type='text'
						className='w-full px-2 py-1 rounded-lg border'
					/>
					<button
						type='button'
						title='close menu'
						onClick={toggleSearchBar}>
						<X className='scale-125 hover:scale-95 transition-all duration-300' />
					</button>
				</div>
			</motion.div>
		</Overlay>,
		document.getElementById('overlays')!
	);
};

const SearchAction: React.FC = () => {
	const [toggleSearch, setToggleSearch] = useState<boolean>(false);
	const toggleSearchBar = () => {
		setToggleSearch((prev) => !prev);
	};
	return (
		<>
			<button
				onClick={toggleSearchBar}
				title='search'
				type='button'
				className='transition-all hover:scale-110 duration-300'>
				<Search size={20} />
			</button>
			<AnimatePresence>
				{toggleSearch && (
					<SearchActionPopUp toggleSearchBar={toggleSearchBar} />
				)}
			</AnimatePresence>
		</>
	);
};

export default SearchAction;
