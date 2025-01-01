import type { Metadata } from 'next';
import { Quicksand, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import { Providers } from '@/store/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import CartSidebar from '@/components/ui/cart/CartSidebar';

const quicksand = Quicksand({ subsets: ['latin'] });
export const libre = Libre_Baskerville({ weight: '700', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Rude Clothing',
    description: 'Up your clothing game',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={quicksand.className}>
                <Providers>
                    <section id='overlays'>
                        <Toast />
                        <CartSidebar />
                    </section>
                    <Header />
                    <main className='max-w-7xl mx-auto'>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
