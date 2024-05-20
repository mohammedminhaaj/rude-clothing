'use client';

import { MessageProvider } from './MessageProvider';

export const Providers = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <MessageProvider>{children}</MessageProvider>;
};
