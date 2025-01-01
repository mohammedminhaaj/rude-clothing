import { libre } from '@/app/layout';
import Social from './Social';
import NavActions from './NavActions';
import SearchAction from './SearchAction';
import NavItems from './NavItems';
import MenuAction from './MenuAction';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const NavigationBar: React.FC = () => (
    <nav className='flex justify-around items-center md:items-start p-3'>
        <section className='basis-1/5'>
            <span className='hidden md:flex'>
                <Social />
            </span>
            <span className='flex gap-5 md:hidden'>
                <MenuAction />
                <SearchAction />
            </span>
        </section>
        <section className='flex flex-col gap-3 basis-3/5'>
            <Link
                href={'/'}
                className={`${libre.className} text-2xl md:text-4xl lg:text-5xl text-center`}
            >
                RUDE
            </Link>
            <section className='hidden md:block'>
                <NavItems />
            </section>
        </section>
        <Suspense
            fallback={
                <span className='basis-1/5 flex items-center justify-end'>
                    <Loader2 className='animate-spin' />
                </span>
            }
        >
            <NavActions />
        </Suspense>
    </nav>
);
export default NavigationBar;
