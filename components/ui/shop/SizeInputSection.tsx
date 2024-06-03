import { useId } from 'react';
import { SingleProductTag } from './QuickAddSection';

type SizeInputProps = {
	tag: SingleProductTag;
	isSelected: boolean;
	updateProductTag: (id: number) => void;
};

type SizeInputSectionProps = {
	availableSizes: SingleProductTag[];
	selectedTag: number | null;
	updateProductTag: (id: number) => void;
};

const SizeInput: React.FC<SizeInputProps> = ({
	tag,
	isSelected,
	updateProductTag,
}: SizeInputProps) => {
	const inputId = useId();
	return (
		<div className='size-10 flex items-center justify-center cursor-pointer'>
			<input
				onChange={() => {
					updateProductTag(tag.id);
				}}
				checked={isSelected}
				name='radio-size'
				className='sr-only peer'
				id={inputId}
				type='radio'
			/>
			<label
				className='text-l rounded text-center cursor-pointer border w-full h-full peer-checked:border-slate-500 peer-checked:border-2 uppercase flex justify-center items-center'
				htmlFor={inputId}>
				{tag.tag.name}
			</label>
		</div>
	);
};

const SizeInputSection: React.FC<SizeInputSectionProps> = ({
	availableSizes,
	selectedTag,
	updateProductTag,
}: SizeInputSectionProps) => {
	return (
		<section className='border-y py-5 flex justify-between items-center'>
			<legend className='basis-1/6 text-sm'>Size</legend>
			{availableSizes.length === 0 ? (
				<p className='font-extralight'>No sizes available</p>
			) : (
				<form className='basis-5/6'>
					<fieldset className='flex flex-wrap gap-5'>
						{availableSizes.map((item) => (
							<SizeInput
								key={item.id}
								tag={item}
								updateProductTag={updateProductTag}
								isSelected={selectedTag === item.id}
							/>
						))}
					</fieldset>
				</form>
			)}
		</section>
	);
};

export default SizeInputSection;
