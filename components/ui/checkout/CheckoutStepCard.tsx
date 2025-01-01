'use client';

import { Child } from '@/lib/types';
import {
    CheckoutCardIndex,
    useCheckoutContext,
} from '@/store/CheckoutProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

type CheckoutStepCardProps = Child & {
    step: number;
    heading: string;
};

const CheckoutStepCard: React.FC<CheckoutStepCardProps> = ({
    step,
    heading,
    children,
}: CheckoutStepCardProps) => {
    const { allowedIndex, currentIndex, setCurrentIndex, isCompleted } =
        useCheckoutContext();

    const markCompleted = isCompleted(step as CheckoutCardIndex);

    const isDisabled = !allowedIndex.includes(step as CheckoutCardIndex);

    return (
        <section
            className={`shadow-md w-full p-5 overflow-hidden ${
                isDisabled ? 'opacity-50' : ''
            }`}
        >
            <header>
                <button
                    type='button'
                    title={heading}
                    onClick={() => {
                        if (isDisabled) return;
                        setCurrentIndex(step as CheckoutCardIndex);
                    }}
                    className='flex gap-3 items-center w-full'
                >
                    <div
                        className={`rounded-full text-white bg-slate-900 size-8 md:size-10 flex items-center justify-center`}
                    >
                        {markCompleted ? <Check className='size-5' /> : step}
                    </div>
                    <h2 className='font-bold text-lg'>{heading}</h2>
                </button>
            </header>
            <AnimatePresence>
                {currentIndex === step && allowedIndex.includes(step) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'fit-content',
                            marginTop: '0.75rem',
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CheckoutStepCard;
