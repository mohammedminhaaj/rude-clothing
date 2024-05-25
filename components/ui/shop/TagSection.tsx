'use client';

import { ArrowLeft, Filter } from 'react-feather';
import TagList from './TagList';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SortMenu from './SortMenu';

export type TagSectionProps = {
	tags: {
		[key: string]: string[];
	};
};

const TagSection: React.FC<TagSectionProps> = ({ tags }: TagSectionProps) => {
	const [toggleTagSidebar, setToggleTagSidebar] = useState<boolean>(false);

	const handleTagSidebar = () => {
		setToggleTagSidebar((prev) => !prev);
	};

	return (
		<>
			<section className='border-y p-5 flex justify-between items-center sticky top-0 bg-white z-10 col-span-12 w-full'>
				<button
					type='button'
					title='toggle filter sidebar'
					onClick={handleTagSidebar}
					className='font-extralight uppercase text-xs flex items-center gap-2'>
					<Filter strokeWidth={1} size={12} />
					{toggleTagSidebar ? 'Hide' : 'Show'} filters
				</button>
				<SortMenu />
			</section>
			<AnimatePresence>
				{toggleTagSidebar && (
					<>
						<motion.div
							key={'tag-sidebar'}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleTagSidebar}
							className='md:hidden z-20 backdrop-brightness-75 w-screen h-screen fixed top-0'></motion.div>
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -20, opacity: 0 }}
							transition={{ bounce: false }}
							className='md:relative md:col-span-3 md:h-fit fixed top-0 w-full sm:w-2/5 md:w-full bg-white md:bg-transparent h-screen z-20 md:z-0 overflow-y-auto overflow-x-hidden filter-column'>
							<header className='md:hidden sticky top-0 bg-white z-10'>
								<button
									type='button'
									title='close sidebar'
									onClick={handleTagSidebar}
									className='flex gap-2 items-center p-5 transition-all hover:gap-4 w-full'>
									<ArrowLeft size={20} strokeWidth={1} /> Go
									Back
								</button>
							</header>

							<TagList key={'filter-sidebar'} tags={tags} />
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default TagSection;
