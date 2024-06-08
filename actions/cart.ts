'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';
import { db } from '@/lib/drizzle/db';
import { Cart, Users } from '@/lib/drizzle/schema';
import { QuantityMode, ServerResponse } from '@/lib/types';
import { and, eq } from 'drizzle-orm';
import { User } from '@supabase/supabase-js';

export const getCartData = async (user: User | null) => {
	const supabase = createClient();

	if (!user) {
		throw new Error('Unable to get cart data. No user found');
	}

	const cart = await db.query.Cart.findMany({
		columns: {
			id: true,
			quantity: true,
		},
		with: {
			productTag: {
				columns: {
					id: true,
				},
				with: {
					product: {
						columns: {
							id: true,
							name: true,
							price: true,
						},
						with: {
							productImages: {
								columns: {
									imagePath: true,
								},
								limit: 1,
							},
						},
					},
					tag: {
						columns: {
							name: true,
						},
					},
				},
			},
		},
		where: (Cart, { eq }) => eq(Cart.user, user.id),
	});

	cart.map((cartItem) => {
		cartItem.productTag.product.productImages =
			cartItem.productTag.product.productImages.map((cartImage) => {
				const { data: imageURL } = supabase.storage
					.from('images')
					.getPublicUrl(cartImage.imagePath);
				return { imagePath: imageURL.publicUrl };
			});
	});

	return cart;
};

export const deleteCart = async (id: number) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (!user) {
		return {
			code: 500,
			message: 'Failed to remove item. No user found',
		} as ServerResponse;
	}
	try {
		const deletedCartId: { deletedId: number }[] = await db
			.delete(Cart)
			.where(and(eq(Cart.id, id), eq(Cart.user, user.id)))
			.returning({ deletedId: Cart.id });
		return {
			code: 200,
			message: 'Product removed from cart',
			data: deletedCartId,
		} as ServerResponse;
	} catch {
		return {
			code: 500,
			message: 'Something went wrong! Product was not deleted',
		} as ServerResponse;
	}
};

export const addToCart = async (selectedTag: number) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (!user) {
		return {
			code: 500,
			message: 'Failed to add item. No user found',
		} as ServerResponse;
	}
	try {
		const availableRecord = await db.query.Cart.findFirst({
			columns: {
				id: true,
				quantity: true,
			},
			with: {
				productTag: {
					columns: {
						id: true,
					},
					with: {
						product: {
							columns: {
								availableQuantity: true,
							},
						},
					},
				},
			},
			where: (Cart, { and, eq }) =>
				and(eq(Cart.user, user.id), eq(Cart.productTag, selectedTag)),
		});
		if (availableRecord) {
			if (
				availableRecord.quantity >=
				availableRecord.productTag.product.availableQuantity
			) {
				const response = await db
					.update(Cart)
					.set({
						quantity:
							availableRecord.productTag.product
								.availableQuantity,
					})
					.where(
						and(eq(Cart.user, user.id), eq(Cart.id, selectedTag))
					)
					.returning({ id: Cart.id, quantity: Cart.quantity });
				return {
					code: 400,
					message: 'Cannot increase the quantity anymore',
					data: {
						id: response[0]?.id,
						quantity: response[0]?.quantity ?? 0,
						quantityUpdated: true,
					},
				} as ServerResponse;
			}
			const response = await db
				.update(Cart)
				.set({ quantity: availableRecord.quantity + 1 })
				.where(
					and(
						eq(Cart.user, user.id),
						eq(Cart.productTag, selectedTag)
					)
				)
				.returning({ id: Cart.id, quantity: Cart.quantity });
			return {
				code: 200,
				message: 'Cart Item Updated',
				data: {
					id: response[0]?.id,
					quantity: response[0]?.quantity,
					quantityUpdated: true,
				},
			} as ServerResponse;
		} else {
			const response = await db
				.insert(Cart)
				.values({ user: user.id, productTag: selectedTag })
				.returning({ id: Cart.id, quantity: Cart.quantity });
			return {
				code: 200,
				message: 'Cart Item Added',
				data: { id: response[0]?.id, quantity: response[0]?.quantity },
			} as ServerResponse;
		}
	} catch (error) {
		return {
			code: 500,
			message: 'Failed to add item',
		} as ServerResponse;
	}
};

export const updateQuantity = async (id: number, mode: QuantityMode) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);
	if (!user) {
		return {
			code: 500,
			message: 'Failed to add item. No user found',
		} as ServerResponse;
	}
	try {
		const availableRecord = await db.query.Cart.findFirst({
			columns: {
				id: true,
				quantity: true,
			},
			with: {
				productTag: {
					columns: {
						id: true,
					},
					with: {
						product: {
							columns: {
								availableQuantity: true,
							},
						},
					},
				},
			},
			where: (Cart, { and, eq }) =>
				and(eq(Cart.user, user.id), eq(Cart.id, id)),
		});
		if (!availableRecord) {
			return {
				code: 500,
				message: 'Something went wrong! Unable to get the cart item.',
			} as ServerResponse;
		}
		switch (mode) {
			case QuantityMode.INCREASE: {
				if (
					availableRecord.quantity >=
					availableRecord.productTag.product.availableQuantity
				) {
					const response = await db
						.update(Cart)
						.set({
							quantity:
								availableRecord.productTag.product
									.availableQuantity,
						})
						.where(and(eq(Cart.user, user.id), eq(Cart.id, id)))
						.returning({ quantity: Cart.quantity });
					return {
						code: 400,
						message: 'Cannot increase the quantity anymore',
						data: { quantity: response[0]?.quantity ?? 0 },
					} as ServerResponse;
				}

				const response = await db
					.update(Cart)
					.set({ quantity: availableRecord.quantity + 1 })
					.where(and(eq(Cart.user, user.id), eq(Cart.id, id)))
					.returning({ quantity: Cart.quantity });
				return {
					code: 200,
					message: 'Cart Item Updated',
					data: { quantity: response[0]?.quantity ?? 0 },
				} as ServerResponse;
			}
			case QuantityMode.DECREASE: {
				if (
					availableRecord.quantity >
					availableRecord.productTag.product.availableQuantity
				) {
					const response = await db
						.update(Cart)
						.set({
							quantity:
								availableRecord.productTag.product
									.availableQuantity,
						})
						.where(and(eq(Cart.user, user.id), eq(Cart.id, id)))
						.returning({ quantity: Cart.quantity });
					return {
						code: 400,
						message: 'Cannot decrease the quantity anymore',
						data: { quantity: response[0]?.quantity ?? 0 },
					} as ServerResponse;
				}

				const response = await db
					.update(Cart)
					.set({ quantity: availableRecord.quantity - 1 })
					.where(and(eq(Cart.user, user.id), eq(Cart.id, id)))
					.returning({ quantity: Cart.quantity });
				return {
					code: 200,
					message: 'Cart Item Updated',
					data: { quantity: response[0]?.quantity ?? 0 },
				} as ServerResponse;
			}
			default: {
				throw new Error(`Invalid mode ${mode}`);
			}
		}
	} catch (error) {
		return {
			code: 500,
			message: 'Something went wrong! Failed to update cart.',
		} as ServerResponse;
	}
};

export const appendCart = async (anonUserId: string) => {
	const supabase = createClient();
	const { user } = await getUser(supabase);

	if (user) {
		await db
			.update(Cart)
			.set({ user: user.id })
			.where(eq(Cart.user, anonUserId));
	}

	await db.delete(Users).where(eq(Users.id, anonUserId));

	const cart = await getCartData(user);

	return cart;
};
