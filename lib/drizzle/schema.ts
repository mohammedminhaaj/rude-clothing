import { sql } from 'drizzle-orm';
import {
	boolean,
	integer,
	numeric,
	pgEnum,
	pgSchema,
	pgTable,
	serial,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

export const ProfileRole = pgEnum('profile_role', ['ADMIN', 'BASIC']);

export const Users = authSchema.table('users', {
	id: uuid('id').primaryKey().notNull(),
	email: varchar('email', { length: 255 }),
	is_anonymous: boolean('is_anonymous').default(false).notNull(),
});

export const Profile = pgTable('profile', {
	authUser: uuid('auth_user_id')
		.references(() => Users.id, { onDelete: 'cascade' })
		.primaryKey(),
	firstName: varchar('first_name', { length: 64 }),
	lastName: varchar('last_name', { length: 64 }),
	role: ProfileRole('profile_role').notNull().default('BASIC'),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const TagParent = pgTable('tag_parent', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 64 }).notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const TagData = pgTable(
	'tag_data',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 64 }).notNull(),
		colorCode: varchar('color_code', { length: 6 }),
		tagMaster: integer('tag_master_id')
			.references(() => TagParent.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull()
			.$onUpdateFn(() => new Date()),
	},
	(table) => {
		return {
			uniqueNameAndTagMaster: unique('unique_name_and_tag_master').on(
				table.name,
				table.tagMaster
			),
		};
	}
);

export const Product = pgTable('product', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	description: varchar('description', { length: 1024 }).notNull(),
	images: varchar('images', { length: 64 })
		.array()
		.notNull()
		.default(sql`'{}'::varchar[]`),
	price: numeric('price', { precision: 7, scale: 2 }).notNull(),
	discount: numeric('discount', { precision: 5, scale: 2 }),
	availableQuantity: integer('available_quantity').notNull(),
	isFeatured: boolean('is_featured').default(false).notNull(),
	searchTag: varchar('search_tag'),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const ProductTag = pgTable(
	'product_tag',
	{
		id: serial('id').primaryKey(),
		product: uuid('product_id')
			.notNull()
			.references(() => Product.id, {
				onDelete: 'cascade',
			}),

		tagData: integer('tag_data_id')
			.notNull()
			.references(() => TagData.id, {
				onDelete: 'cascade',
			}),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull()
			.$onUpdateFn(() => new Date()),
	},
	(table) => ({
		unique_product_tag: unique('unique_product_tag').on(
			table.product,
			table.tagData
		),
	})
);

export const Cart = pgTable(
	'cart',
	{
		id: serial('id').primaryKey(),
		profile: uuid('profile_id')
			.references(() => Profile.authUser, { onDelete: 'cascade' })
			.notNull(),
		productTag: integer('product_tag_id')
			.notNull()
			.references(() => ProductTag.id, {
				onDelete: 'cascade',
			}),

		quantity: integer('quantity').notNull().default(1),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
			.defaultNow()
			.notNull()
			.$onUpdateFn(() => new Date()),
	},
	(table) => ({
		unique_profile_product_tag: unique('unique_profile_product_tag').on(
			table.profile,
			table.productTag
		),
	})
);

export const CouponType = pgEnum('coupon_type', ['FIXED', 'PERCENTAGE']);

export const Coupon = pgTable('coupon', {
	id: serial('id').primaryKey(),
	code: varchar('code', { length: 16 }).notNull().unique(),
	description: varchar('description', { length: 255 }).notNull(),
	couponType: CouponType('type').notNull(),
	rate: numeric('discount_rate', { precision: 7, scale: 2 }).notNull(),
	maxDiscountAmount: numeric('max_discount_amount', {
		precision: 7,
		scale: 2,
	}),
	minOrderAmount: numeric('min_order_amount', { precision: 7, scale: 2 }),
	validFrom: timestamp('valid_from', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	validUntil: timestamp('valid_until', { withTimezone: true, mode: 'date' }),
	usageLimit: integer('usage_limit'),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
});
