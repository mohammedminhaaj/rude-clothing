'use client';

import { CartProvider } from './CartProvider';
import { MessageProvider } from './MessageProvider';

export const Providers = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<MessageProvider>
			<CartProvider>{children}</CartProvider>
		</MessageProvider>
	);
};
