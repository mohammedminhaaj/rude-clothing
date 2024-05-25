import { nanoid } from 'nanoid';
import { TagSectionProps } from './TagSection';
import { memo, useId, useRef, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, X } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { TagProvider, useTagContext } from '@/store/TagListProvider';

type TagProp = {
	header: string;
};

type TagComponentProp = TagProp & {
	childList: string[];
};

type TagItemProps = TagProp & {
	child: string;
};

const TagItem: React.FC<TagItemProps> = ({ header, child }: TagItemProps) => {
	const id = useId();
	const checkboxRef = useRef<HTMLInputElement>(null);

	const pathName = usePathname();
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	const { insertTag, removeTag } = useTagContext();

	const paramAvailable = searchParams.has(header, child);

	const handleCheck = () => {
		const isChecked = checkboxRef.current?.checked;
		const params = new URLSearchParams(searchParams);

		if (isChecked) {
			params.append(header, child);
			insertTag(header, child);
		} else {
			params.delete(header, child);
			removeTag(header, child);
		}

		replace(`${pathName}?${params.toString()}`, { scroll: false });
	};

	return (
		<li className='font-extralight text-xs flex items-center gap-2'>
			<input
				ref={checkboxRef}
				id={id}
				checked={paramAvailable}
				onChange={handleCheck}
				type='checkbox'
				className='accent-slate-600'
			/>
			<label className='cursor-pointer' htmlFor={id}>
				{child}
			</label>
		</li>
	);
};

const TagComponent: React.FC<TagComponentProp> = ({
	header,
	childList,
}: TagComponentProp) => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const toggleTagList = () => {
		setIsOpen((prev) => !prev);
	};
	return (
		<>
			<button
				title={`expand ${header}`}
				type='button'
				onClick={toggleTagList}
				className='font-extrabold uppercase text-sm w-full flex justify-between items-center'>
				{header}
				<ChevronDown
					className={`transition-transform duration-300 ${
						isOpen ? 'rotate-180' : 'rotate-0'
					}`}
					size={16}
					strokeWidth={1}
				/>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						key={`${header}-list`}
						initial={{ opacity: 0, height: 0, margin: 0 }}
						animate={{
							opacity: 1,
							height: 'fit-content',
							margin: '1.25rem 0 1.25rem 0',
						}}
						exit={{ opacity: 0, height: 0, margin: 0 }}
						transition={{ bounce: false }}
						className='space-y-2'>
						{childList.map((item) => {
							const childId: string = nanoid();
							return (
								<TagItem
									key={childId}
									header={header}
									child={item}
								/>
							);
						})}
					</motion.ul>
				)}
			</AnimatePresence>
		</>
	);
};

const AppliedTags: React.FC = () => {
	const { tags, removeTag, clearAll } = useTagContext();
	return (
		!!tags.length && (
			<div className='flex flex-wrap gap-2'>
				<button
					type='button'
					title='clear filters'
					onClick={clearAll}
					className='uppercase underline font-extralight text-xs'>
					Clear All
				</button>
				{tags.map((item, index) => {
					const [headerParam, childParam] = item.split(':');
					return (
						<p
							key={`${item}-${index}`}
							className='border text-xs p-1 flex gap-1 items-center justify-between'>
							{item}
							<button
								onClick={() =>
									removeTag(headerParam, childParam)
								}
								type='button'
								title={`remove filter ${item}`}>
								<X size={14} strokeWidth={1} />
							</button>
						</p>
					);
				})}
			</div>
		)
	);
};

const TagList: React.FC<TagSectionProps> = ({ tags }: TagSectionProps) => {
	return (
		<TagProvider>
			<section className='p-5 uppercase space-y-5'>
				<AppliedTags />
				{Object.entries(tags).map((item) => {
					const headerId: string = nanoid();
					return (
						<TagComponent
							key={headerId}
							header={item[0]}
							childList={item[1]}
						/>
					);
				})}
			</section>
		</TagProvider>
	);
};

const tagListPropsAreEqual: (
	prevProps: TagSectionProps,
	nextProps: TagSectionProps
) => boolean = (prevProps: TagSectionProps, nextProps: TagSectionProps) => {
	const prevPropsEntries = Object.entries(prevProps);
	const nextPropsEntries = Object.entries(nextProps);
	try {
		for (let i = 0; i < prevPropsEntries.length; i++) {
			for (let j = 0; j < prevPropsEntries.length; j++) {
				if (prevPropsEntries[i][0] !== nextPropsEntries[i][0])
					return false;

				if (prevPropsEntries[i][1][j] !== nextPropsEntries[i][1][j])
					return false;
			}
		}
		return true;
	} catch {
		return false;
	}
};

export default memo(TagList, tagListPropsAreEqual);
