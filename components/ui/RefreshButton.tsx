import { RefreshCw } from 'lucide-react';

const RefreshButton: React.FC<{ reset: () => void }> = ({
    reset,
}: {
    reset: () => void;
}) => (
    <button
        className='rounded flex gap-2 items-center justify-center md:px-2 md:py-1 p-2 bg-slate-700 text-white transition-all duration-300 hover:gap-3 hover:bg-transparent hover:text-black'
        onClick={() => reset()}
    >
        <RefreshCw size={16} className='stroke-1' />
        <p className='hidden md:block'>Try again</p>
    </button>
);

export default RefreshButton;
