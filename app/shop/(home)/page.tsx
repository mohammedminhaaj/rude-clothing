import Image from 'next/image';

const ShopPage: React.FC = () => {
	return (
		<>
			<figure className='relative bg-gray-300'>
				<Image
					alt='hero image'
					loading='lazy'
					src={'/images/shop_hero_image.jpg'}
					style={{
						objectFit: 'cover',
						objectPosition: 'center',
					}}
					fill
					className='brightness-50'
				/>
				<figcaption className='relative uppercase h-60 md:h-72 lg:h-80 flex justify-center items-center text-white text-5xl md:text-6xl lg:text-7xl'>
					Shop
				</figcaption>
			</figure>
			<section className='p-5 md:p-10'>
				<div className='bg-gray-300 p-5 md:p-10 flex flex-wrap gap-5'>
					<p className='uppercase font-extrabold text-2xl'>
						Save Extra on Sale
					</p>
					<p className=''>For a limited time, save an extra 15%</p>
				</div>
			</section>
		</>
	);
};

export default ShopPage;
