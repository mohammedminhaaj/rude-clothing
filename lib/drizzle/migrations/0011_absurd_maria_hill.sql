DO $$ BEGIN
 CREATE TYPE "public"."coupon_type" AS ENUM('FIXED', 'PERCENTAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupon" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"description" varchar(255) NOT NULL,
	"type" "coupon_type" NOT NULL,
	"discount_rate" numeric(7, 2),
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
