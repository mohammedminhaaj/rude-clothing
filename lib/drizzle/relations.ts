import { relations } from 'drizzle-orm';
import {
	Cart,
	Product,
	ProductImage,
	ProductTag,
	Profile,
	TagData,
	TagMaster,
	Users,
} from './schema';

export const userRelations = relations(Users, ({ one }) => ({
	profile: one(Profile),
}));

export const profileRelations = relations(Profile, ({ one, many }) => ({
	user: one(Users, {
		fields: [Profile.authUser],
		references: [Users.id],
	}),
	cart: many(Cart),
}));

export const tagMasterRelations = relations(TagMaster, ({ many }) => ({
	tagData: many(TagData),
}));

export const tagDataRelations = relations(TagData, ({ one, many }) => ({
	tagMaster: one(TagMaster, {
		fields: [TagData.tagMaster],
		references: [TagMaster.id],
	}),
	products: many(ProductTag),
}));

export const productRelations = relations(Product, ({ many }) => ({
	productImages: many(ProductImage),
	tags: many(ProductTag),
}));

export const productImageRelations = relations(ProductImage, ({ one }) => ({
	product: one(Product, {
		fields: [ProductImage.product],
		references: [Product.id],
	}),
}));

export const productTagRelations = relations(ProductTag, ({ one, many }) => ({
	product: one(Product, {
		fields: [ProductTag.product],
		references: [Product.id],
	}),
	tag: one(TagData, {
		fields: [ProductTag.tagData],
		references: [TagData.id],
	}),
	cart: many(Cart),
}));

export const cartRelations = relations(Cart, ({ one }) => ({
	productTag: one(ProductTag, {
		fields: [Cart.productTag],
		references: [ProductTag.id],
	}),
	profile: one(Profile, {
		fields: [Cart.user],
		references: [Profile.authUser],
	}),
}));
