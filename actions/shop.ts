'use server';

import { PAGINATION_ITEMS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { ProductListType, SearchParamType, TagData } from '@/lib/types';
import { PostgrestError } from '@supabase/supabase-js';

export const getTags = async () => {
	const supabase = createClient();
	const responseData: { [key: string]: string[] } = {};

	const { data, error } = (await supabase
		.from('tag_data')
		.select('name, tag_master_id (name)')) as {
		data: TagData[];
		error: PostgrestError | null;
	};

	if (error) throw new Error(error.message);

	for (const item of data) {
		item.tag_master_id.name in responseData
			? responseData[item.tag_master_id.name].push(item.name)
			: (responseData[item.tag_master_id.name] = [item.name]);
	}
	return responseData;
};

const sortHelper: { [key: string]: { field: string; ascending: boolean } } = {
	az: {
		field: 'name',
		ascending: true,
	},
	za: {
		field: 'name',
		ascending: false,
	},
	lowhigh: {
		field: 'price',
		ascending: true,
	},
	highlow: {
		field: 'price',
		ascending: false,
	},
	oldnew: {
		field: 'created_at',
		ascending: true,
	},
	newold: {
		field: 'created_at',
		ascending: false,
	},
};

export const getProducts = async (searchParams: SearchParamType) => {
	// const supabase = createClient();

	// const page: string | null = searchParams['page'];
	// let parsedPage: number;

	// try {
	// 	parsedPage = page ? parseInt(page) : 1;
	// 	if (isNaN(parsedPage)) throw new Error('Invalid number');
	// } catch {
	// 	parsedPage = 1;
	// }

	// const startLimit: number = PAGINATION_ITEMS * parsedPage - PAGINATION_ITEMS;
	// const endLimit: number = PAGINATION_ITEMS * parsedPage - 1;

	// let query = supabase
	// 	.from('product')
	// 	.select(
	// 		`
	// 		id, 
	// 		name, 
	// 		price, 
	// 		original_price, 
	// 		on_sale, 
	// 		available_quantity,
	// 		product_image (
	// 			image_path
	// 		), 
	// 		tag_data!inner (
	// 			name,
	// 			tag_master_id!inner (
	// 				name
	// 			)
	// 		)
	// 		`,
	// 		{ count: 'exact' }
	// 	)
	// 	.limit(1, { referencedTable: 'product_image' })
	// 	.range(startLimit, endLimit);

	// if ('sort' in searchParams) {
	// 	const sortValue: string = searchParams['sort'];
	// 	const sortParams = sortHelper[sortValue];
	// 	query = query.order(sortParams.field, {
	// 		ascending: sortParams.ascending,
	// 	});
	// }

	// const queryList: string[] = [];

	// Object.entries(searchParams).forEach(
	// 	([key, value]: [key: string, value: string | string[]]) => {
	// 		if (key !== 'page' && key !== 'sort') {
	// 			const comparisionObject = {
	// 				operator: '',
	// 				value: '',
	// 			};
	// 			if (typeof value === 'string') {
	// 				comparisionObject.operator = 'eq';
	// 				comparisionObject.value = value;
	// 			} else {
	// 				comparisionObject.operator = 'in';
	// 				comparisionObject.value = '(' + value.join(',') + ')';
	// 			}
	// 			queryList.push(
	// 				`and(tag_master_id.name.eq.${key},name.${comparisionObject.operator}.${comparisionObject.value})`
	// 			);
	// 		}
	// 	}
	// );

	// if (!!queryList.length) {
	// 	query = query.or(
	// 		'and(tag_master_id.name.eq.gender,name.eq.men),and(tag_master_id.name.eq.size,name.eq.xs)',
	// 		{ referencedTable: 'tag_data' }
	// 	);
	// }

	// const { data, error, count } = (await query) as {
	// 	data: ProductListType[] | null;
	// 	error: PostgrestError | null;
	// 	count: number | null;
	// };

	// console.log(error?.details);
	// console.log(queryList.join(','));

	// if (error) throw new Error(error.message);

	// return { data, count };
};
