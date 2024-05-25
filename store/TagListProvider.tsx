'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useState } from 'react';

interface TagContextProps {
	tags: string[];
	insertTag: (header: string, child: string) => void;
	removeTag: (header: string, child: string) => void;
	clearAll: () => void;
}

const TagContext = createContext<TagContextProps>({
	tags: [],
	insertTag: (header: string, child: string) => {},
	removeTag: (header: string, child: string) => {},
	clearAll: () => {},
});

export const TagProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const pathName = usePathname();
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	const initialTags: string[] = [];

	searchParams.forEach((value, key) => {
		!['page', 'sort'].includes(key) && initialTags.push(`${key}:${value}`);
	});

	const [tags, setTags] = useState<string[]>(initialTags);

	const insertTag = useCallback((header: string, child: string) => {
		setTags((previous: string[]) => [...previous, `${header}:${child}`]);
	}, []);

	const removeTag = useCallback((header: string, child: string) => {
		setTags((previous: string[]) => [
			...previous.filter((item) => item !== `${header}:${child}`),
		]);

		const newSearchParams = window.location.search;

		const params = new URLSearchParams(newSearchParams);

		params.has(header, child) && params.delete(header, child);

		replace(`${pathName}?${params.toString()}`, { scroll: false });
	}, []);

	const clearAll = useCallback(() => {
		replace(pathName, { scroll: false });
		setTags([]);
	}, []);

	return (
		<TagContext.Provider value={{ tags, insertTag, removeTag, clearAll }}>
			{children}
		</TagContext.Provider>
	);
};

export const useTagContext: () => TagContextProps = () =>
	useContext(TagContext);
