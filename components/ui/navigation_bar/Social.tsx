import { Instagram } from 'lucide-react';

const Social: React.FC = () => (
    <ul className='flex gap-2 items-center'>
        <li>
            <Instagram className='transition-all hover:scale-110 duration-300 stroke-1' />
        </li>
    </ul>
);

export default Social;
