DO $$ BEGIN
 CREATE TYPE "public"."coupon_type" AS ENUM('FIXED', 'PERCENTAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."profile_role" AS ENUM('ADMIN', 'BASIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"product_tag_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_profile_product_tag" UNIQUE("profile_id","product_tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupon" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(16) NOT NULL,
	"description" varchar(255) NOT NULL,
	"type" "coupon_type" NOT NULL,
	"discount_rate" numeric(7, 2) NOT NULL,
	"max_discount_amount" numeric(7, 2),
	"min_order_amount" numeric(7, 2),
	"valid_from" timestamp with time zone NOT NULL,
	"valid_until" timestamp with time zone,
	"usage_limit" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupon_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"images" varchar(64)[] DEFAULT '{}'::varchar[] NOT NULL,
	"price" numeric(7, 2) NOT NULL,
	"discount" numeric(5, 2),
	"available_quantity" integer NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"search_tag" varchar,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"tag_data_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_product_tag" UNIQUE("product_id","tag_data_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"auth_user_id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(64),
	"last_name" varchar(64),
	"profile_role" "profile_role" DEFAULT 'BASIC' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"color_code" varchar(6),
	"tag_master_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_name_and_tag_master" UNIQUE("name","tag_master_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag_parent" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tag_parent_name_unique" UNIQUE("name")
);
--> statement-breakpoint
-- CREATE TABLE IF NOT EXISTS "auth"."users" (
-- 	"id" uuid PRIMARY KEY NOT NULL,
-- 	"email" varchar(255),
-- 	"is_anonymous" boolean DEFAULT false NOT NULL
-- );
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_profile_id_profile_auth_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("auth_user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_product_tag_id_product_tag_id_fk" FOREIGN KEY ("product_tag_id") REFERENCES "public"."product_tag"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_tag" ADD CONSTRAINT "product_tag_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_tag" ADD CONSTRAINT "product_tag_tag_data_id_tag_data_id_fk" FOREIGN KEY ("tag_data_id") REFERENCES "public"."tag_data"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_auth_user_id_users_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_data" ADD CONSTRAINT "tag_data_tag_master_id_tag_parent_id_fk" FOREIGN KEY ("tag_master_id") REFERENCES "public"."tag_parent"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
