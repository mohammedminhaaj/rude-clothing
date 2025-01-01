import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const ImageCarousel: React.FC<{ images: string[] }> = ({
    images,
}: {
    images: string[];
}) => {
    const [[page, direction], setPage] = useState([0, 0]);

    const imageIndex = ((page % images.length) + images.length) % images.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <>
            <AnimatePresence
                initial={false}
                mode='popLayout'
                custom={direction}
            >
                <motion.picture
                    className='flex h-full'
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial='enter'
                    animate='center'
                    exit='exit'
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag='x'
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                >
                    <Image
                        src={images[imageIndex]}
                        alt='product image'
                        fill
                        loading='lazy'
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />
                </motion.picture>
            </AnimatePresence>
            <button
                title='previous image'
                type='button'
                className='absolute -translate-y-1/2 top-1/2 left-5 rounded bg-white p-2 shadow'
                onClick={() => paginate(-1)}
            >
                <ChevronLeft className='stroke-1' />
            </button>
            <button
                title='next image'
                type='button'
                className='absolute -translate-y-1/2 right-5 top-1/2 rounded bg-white p-2 shadow'
                onClick={() => paginate(1)}
            >
                <ChevronRight className='stroke-1' />
            </button>
        </>
    );
};

export default ImageCarousel;
