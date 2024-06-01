import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent as mEvent, memo, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

const SortMenu: React.FC = () => {
	const [toggleSortSidebar, setToggleSortSidebar] = useState<boolean>(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const pathName = usePathname();
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setToggleSortSidebar(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	});

	const handleSortSidebar = () => {
		!sidebarRef.current && setToggleSortSidebar((prev) => !prev);
	};

	const handleClick = (event: mEvent<HTMLButtonElement, MouseEvent>) => {
		const currentValue = event.currentTarget.value;
		const params = new URLSearchParams(searchParams);

		params.set('sort', currentValue);

		replace(`${pathName}?${params.toString()}`, { scroll: false });
		setToggleSortSidebar(false);
	};

	const handleClear = () => {
		const params = new URLSearchParams(searchParams);

		params.delete('sort');

		replace(`${pathName}?${params.toString()}`, { scroll: false });
		setToggleSortSidebar(false);
	};

	return (
		<>
			<button
				type='button'
				title='toggle sort sidebar'
				onClick={handleSortSidebar}
				className='font-extralight uppercase text-xs flex items-center gap-2'>
				Sort by
				<ChevronDown
					className={`${
						toggleSortSidebar ? 'rotate-180' : ''
					} transition-transform duration-300`}
					strokeWidth={1}
					size={12}
				/>
			</button>
			<AnimatePresence>
				{toggleSortSidebar && (
					<motion.aside
						ref={sidebarRef}
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: 20, opacity: 0 }}
						transition={{ bounce: false }}
						className='absolute bg-white right-0 top-14 border p-2'>
						<ul className='text-sm'>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'az') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'az'}
									type='button'
									title='sort alphabetically from a to z'>
									Alphabetically, A-Z
								</button>
							</li>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'za') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'za'}
									type='button'
									title='sort alphabetically from z to a'>
									Alphabetically, Z-A
								</button>
							</li>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'lowhigh') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'lowhigh'}
									type='button'
									title='sort based on price low to high'>
									Price, Low to High
								</button>
							</li>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'highlow') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'highlow'}
									type='button'
									title='sort based on price high to low'>
									Price, High to Low
								</button>
							</li>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'oldnew') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'oldnew'}
									type='button'
									title='sort old to new'>
									Date, Old to New
								</button>
							</li>
							<li className='hover:bg-gray-200 p-2'>
								<button
									className={`${
										searchParams.has('sort', 'newold') &&
										'underline underline-offset-8'
									}`}
									onClick={handleClick}
									value={'newold'}
									type='button'
									title='sort new to old'>
									Date, New to Old
								</button>
							</li>
							{searchParams.has('sort') && (
								<li className='text-center text-xs font-extralight'>
									<button
										type='button'
										title='clear sort'
										onClick={handleClear}
										className='underline'>
										Clear
									</button>
								</li>
							)}
						</ul>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
};

export default memo(SortMenu);
