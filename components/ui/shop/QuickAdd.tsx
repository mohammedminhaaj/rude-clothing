'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Overlay from '../Overlay';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ProductIdProp } from '@/lib/types';
import QuickAddSection from './QuickAddSection';

type QuickAddSidebarType = {
    handleToggleSidebar: () => void;
} & ProductIdProp;

const QuickAddSidebar: React.FC<QuickAddSidebarType> = ({
    handleToggleSidebar,
    productId,
}: QuickAddSidebarType) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                handleToggleSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    });
    return createPortal(
        <Overlay>
            <motion.aside
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ bounce: 0 }}
                ref={sidebarRef}
                className='fixed right-0 h-full bg-white w-full sm:w-3/4 md:w-2/4 lg:1/4 shadow-2xl overflow-x-hidden'
            >
                <header className='absolute right-5 top-5 z-10'>
                    <button
                        title='close quick add'
                        type='button'
                        onClick={handleToggleSidebar}
                        className='rounded p-2 shadow bg-white group transition-all duration-300 hover:scale-110'
                    >
                        <X className='stroke-1 transition-all group-hover:rotate-180 duration-300' />
                    </button>
                </header>
                <QuickAddSection
                    handleToggleSidebar={handleToggleSidebar}
                    productId={productId}
                />
            </motion.aside>
        </Overlay>,
        document.getElementById('overlays')!
    );
};

const QuickAdd: React.FC<ProductIdProp> = ({ productId }: ProductIdProp) => {
    const [toggleQuickAdd, setToggleQuickAdd] = useState<boolean>(false);

    const handleToggleSidebar = () => {
        setToggleQuickAdd((prev) => !prev);
    };

    return (
        <>
            <button
                onClick={handleToggleSidebar}
                type='button'
                title='quick add'
                className='w-full text-xs text-white bg-slate-700 hover:bg-slate-800 transition-all duration-300 p-2 md:p-4 uppercase flex gap-1 items-center justify-center hover:gap-4'
            >
                <p>Quick</p>
                <p>Add</p>
            </button>
            <AnimatePresence>
                {toggleQuickAdd && (
                    <QuickAddSidebar
                        productId={productId}
                        handleToggleSidebar={handleToggleSidebar}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickAdd;
