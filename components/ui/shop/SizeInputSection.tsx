import { useId } from 'react';
import { SingleProductTag } from './QuickAddSection';

type SizeInputProps = {
	tag: SingleProductTag;
	isSelected: boolean;
};

const SizeInput: React.FC<SizeInputProps> = ({
	tag,
	isSelected,
}: SizeInputProps) => {
	const inputId = useId();
	return (
		<div className='size-10 flex items-center justify-center cursor-pointer'>
			<input
				defaultChecked={isSelected}
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

const SizeInputSection: React.FC<{
	sizeTags: SingleProductTag[];
}> = ({ sizeTags }: { sizeTags: SingleProductTag[] }) => {
	return (
		<section className='border-y py-5 flex justify-between items-center'>
			<legend className='basis-1/6 text-sm'>Size</legend>
			{sizeTags.length === 0 ? (
				<p className='font-extralight'>No sizes available</p>
			) : (
				<form className='basis-5/6'>
					<fieldset className='flex flex-wrap gap-5'>
						{sizeTags.map((item, index) => (
							<SizeInput
								key={item.id}
								tag={item}
								isSelected={index === 0}
							/>
						))}
					</fieldset>
				</form>
			)}
		</section>
	);
};

export default SizeInputSection;
