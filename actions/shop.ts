'use server';

import { PAGINATION_ITEMS } from '@/lib/constants';
import { db } from '@/lib/drizzle/db';
import {
	Product,
	ProductImage,
	ProductTag,
	TagData,
	TagMaster,
} from '@/lib/drizzle/schema';
import { SearchParamType } from '@/lib/types';
import { SQL, asc, countDistinct, desc, eq, sql } from 'drizzle-orm';

export const getTags = async () => {
	const responseData: {
		[key: string]: { name: string; colorCode: string | null }[];
	} = {};

	const data = await db.query.TagData.findMany({
		columns: {
			name: true,
			colorCode: true,
		},
		with: {
			tagMaster: {
				columns: {
					name: true,
				},
			},
		},
	});

	for (const item of data) {
		if (item.tagMaster.name in responseData)
			responseData[item.tagMaster.name].push({
				name: item.name,
				colorCode: item.colorCode,
			});
		else
			responseData[item.tagMaster.name] = [
				{
					name: item.name,
					colorCode: item.colorCode,
				},
			];
	}

	return responseData;
};

const sortHelper: { [key: string]: SQL<unknown> } = {
	az: asc(Product.name),
	za: desc(Product.name),
	lowhigh: asc(Product.price),
	highlow: desc(Product.price),
	oldnew: asc(Product.createdAt),
	newold: desc(Product.createdAt),
};

export const getProducts = async (searchParams: SearchParamType) => {
	const page = parseInt(searchParams['page']) || 1;
	if (isNaN(page) || page < 1) throw new Error('Invalid Page Supplied');

	const offset: number = PAGINATION_ITEMS * (page - 1);

	const productImageQuery = db
		.select({
			imagePath: ProductImage.imagePath,
			productId: ProductImage.product,
		})
		.from(ProductImage)
		.orderBy(asc(ProductImage.id))
		.as('productImageQuery');

	const tagMasterQuery = db
		.select({
			id: TagMaster.id,
			name: TagMaster.name,
		})
		.from(TagMaster)
		.as('tagMasterQuery');

	const tagDataQuery = db
		.select({
			id: TagData.id,
			name: TagData.name,
			tagMaster: TagData.tagMaster,
		})
		.from(TagData)
		.as('tagDataQuery');

	const productTagQuery = db
		.select({
			product: ProductTag.product,
			tagData: ProductTag.tagData,
		})
		.from(ProductTag)
		.as('productTagQuery');

	const baseQuery = db
		.selectDistinctOn([Product.name, Product.price, Product.createdAt], {
			id: Product.id,
			name: Product.name,
			price: Product.price,
			originalPrice: Product.originalPrice,
			onSale: Product.onSale,
			availableQuantity: Product.availableQuantity,
			productImage: productImageQuery.imagePath,
		})
		.from(Product)
		.innerJoin(
			productImageQuery,
			eq(Product.id, productImageQuery.productId)
		)
		.leftJoin(productTagQuery, eq(Product.id, productTagQuery.product))
		.innerJoin(tagDataQuery, eq(productTagQuery.tagData, tagDataQuery.id))
		.innerJoin(
			tagMasterQuery,
			eq(tagDataQuery.tagMaster, tagMasterQuery.id)
		)
		.$dynamic();

	if ('sort' in searchParams) {
		const sortValue: string = searchParams['sort'];
		const sortParams: SQL<unknown> | null = sortHelper[sortValue];
		if (!sortParams) throw new Error('Invalid Sort Name Supplied');
		baseQuery.orderBy(sortParams);
	}

	const whereSqlChunks: SQL[] = [];
	const havingSqlChunks: SQL[] = [];

	Object.entries(searchParams).forEach(
		([key, value]: [key: string, value: string | string[]]) => {
			if (key !== 'page' && key !== 'sort') {
				whereSqlChunks.length !== 0 && whereSqlChunks.push(sql` OR `);
				havingSqlChunks.length !== 0 &&
					havingSqlChunks.push(sql` AND `);

				if (typeof value === 'string') {
					whereSqlChunks.push(
						sql`(${tagMasterQuery.name}=${key} AND ${tagDataQuery.name} = ${value})`
					);
					havingSqlChunks.push(
						sql`COUNT(DISTINCT CASE WHEN ${tagMasterQuery.name}=${key} AND ${tagDataQuery.name} = ${value} THEN ${tagDataQuery.id} END) = 1`
					);
				} else {
					whereSqlChunks.push(
						sql`(${tagMasterQuery.name}=${key} AND ${tagDataQuery.name} IN ${value})`
					);
					havingSqlChunks.push(
						sql`COUNT(DISTINCT CASE WHEN ${tagMasterQuery.name}=${key} AND ${tagDataQuery.name} IN ${value} THEN ${tagDataQuery.id} END) >= 1`
					);
				}
			}
		}
	);

	if (whereSqlChunks.length !== 0) {
		whereSqlChunks.push(sql` AND ${Product.isActive}=true`);
		baseQuery.where(sql.join(whereSqlChunks));
	} else {
		baseQuery.where(eq(Product.isActive, true));
	}

	if (havingSqlChunks.length !== 0) {
		baseQuery
			.groupBy(Product.id, productImageQuery.imagePath)
			.having(sql.join(havingSqlChunks));
	}

	const countQuery = db
		.select({ productCount: countDistinct(Product.id) })
		.from(baseQuery.as('productCount'));

	const dataQuery = baseQuery.limit(PAGINATION_ITEMS).offset(offset);

	const [data, [{ productCount }]] = await Promise.all([
		dataQuery,
		countQuery,
	]);

	return { data, productCount };
};

export const getSingleProduct = async (productId: string) => {
	const result = db.query.Product.findFirst({
		columns: {
			name: true,
			description: true,
			price: true,
			originalPrice: true,
			availableQuantity: true,
			onSale: true,
		},
		with: {
			productImages: {
				columns: {
					imagePath: true,
				},
			},
			tags: {
				columns: {
					id: true,
				},
				with: {
					tag: {
						columns: {
							name: true,
						},
						with: {
							tagMaster: {
								columns: {
									name: true,
								},
							},
						},
					},
				},
			},
		},
		where: (Product, { and, eq }) =>
			and(eq(Product.isActive, true), eq(Product.id, productId)),
	});

	const data = await result;

	return data;
};
