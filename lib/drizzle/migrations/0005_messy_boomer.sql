DO $$ BEGIN
 BEGIN
  ALTER TABLE "auth"."users" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
 END;
END $$;
--> statement-breakpoint
ALTER TABLE "product_image" DROP COLUMN IF EXISTS "is_active";--> statement-breakpoint
ALTER TABLE "product_tag" DROP COLUMN IF EXISTS "is_active";--> statement-breakpoint
ALTER TABLE "tag_data" DROP COLUMN IF EXISTS "is_active";--> statement-breakpoint
ALTER TABLE "tag_master" DROP COLUMN IF EXISTS "is_active";