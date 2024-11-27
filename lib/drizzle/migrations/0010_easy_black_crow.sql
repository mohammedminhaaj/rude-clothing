ALTER TABLE "cart" DROP CONSTRAINT "cart_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "id";
--> statement-breakpoint
ALTER TABLE "profile" ADD PRIMARY KEY ("auth_user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_profile_id_profile_auth_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("auth_user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
