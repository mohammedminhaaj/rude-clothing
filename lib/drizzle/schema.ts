import { sql } from 'drizzle-orm';
import {
	boolean,
	integer,
	numeric,
	pgEnum,
	pgSchema,
	pgTable,
	primaryKey,
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
		.notNull()
		.primaryKey(),
	fullName: varchar('full_name', { length: 255 }),
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

export const TagMaster = pgTable('tag_master', {
	id: serial('id').primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull().unique(),
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
		id: serial('id').primaryKey().notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		colorCode: varchar('color_code', { length: 255 }),
		tagMaster: integer('tag_master_id')
			.references(() => TagMaster.id, {
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
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	description: varchar('description', { length: 1023 }).notNull(),
	price: numeric('price', { precision: 7, scale: 2 }).notNull(),
	originalPrice: numeric('original_price', {
		precision: 7,
		scale: 2,
	}).notNull(),
	availableQuantity: integer('available_quantity').notNull(),
	isFeatured: boolean('is_featured').default(false).notNull(),
	searchTag: varchar('search_tag'),
	onSale: boolean('on_sale').default(false).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const ProductImage = pgTable('product_image', {
	id: serial('id').primaryKey().notNull(),
	product: uuid('product_id')
		.notNull()
		.references(() => Product.id, {
			onDelete: 'cascade',
		}),
	imagePath: varchar('image_path').notNull(),
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
		id: serial('id').notNull(),
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
	(table) => {
		return {
			product_tag_pkey: primaryKey({
				columns: [table.id],
				name: 'product_tag_pkey',
			}),
		};
	}
);

export const Cart = pgTable(
	'cart',
	{
		id: serial('id').notNull().primaryKey(),
		user: uuid('profile_id')
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
		unique_user_product_tag: unique('unique_user_product_tag').on(
			table.user,
			table.productTag
		),
	})
);
