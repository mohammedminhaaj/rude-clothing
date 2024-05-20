import { ZodError } from 'zod';

export const parseZodErrors = (error: ZodError) => {
	const errorDict: { [key: string]: string } = {};
	for (let item of error.issues) errorDict[item.path[0]] = item['message'];
	return errorDict;
};
