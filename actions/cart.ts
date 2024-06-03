'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';
import { db } from '@/lib/drizzle/db';
import { Cart } from '@/lib/drizzle/schema';
import { ServerResponse } from '@/lib/types';
import { and, eq, sql } from 'drizzle-orm';

export const addToCart = async (selectedTag: number) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (!user) {
		return {
			code: 500,
			message: 'Failed to add item',
		} as ServerResponse;
	} else {
		try {
			const availableRecord = await db.query.Cart.findFirst({
				columns: {
					id: true,
					quantity: true,
				},
				where: (Cart, { and, eq }) =>
					and(
						eq(Cart.user, user.id),
						eq(Cart.productTag, selectedTag)
					),
			});
			if (availableRecord) {
				await db
					.update(Cart)
					.set({ quantity: availableRecord.quantity + 1 })
					.where(
						and(
							eq(Cart.user, user.id),
							eq(Cart.productTag, selectedTag)
						)
					);
				return {
					code: 200,
					message: 'Cart Item Updated',
				} as ServerResponse;
			} else {
				await db
					.insert(Cart)
					.values({ user: user.id, productTag: selectedTag });
				return {
					code: 200,
					message: 'Cart Item Added',
				} as ServerResponse;
			}
		} catch (error) {
			console.log(error);
			return {
				code: 400,
				message: 'Failed to add item',
			} as ServerResponse;
		}
	}

	const availableRecord = await db.query.Cart.findFirst({
		columns: {
			id: true,
			quantity: true,
		},
		where: (Cart, { and, eq }) =>
			and(
				eq(Cart.user, user?.id ?? ''),
				eq(Cart.productTag, selectedTag)
			),
	});
};
