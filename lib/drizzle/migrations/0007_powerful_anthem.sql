ALTER TABLE "product_tag" DROP CONSTRAINT product_tag_pkey;
--> statement-breakpoint
ALTER TABLE "product_tag" ADD CONSTRAINT product_tag_pkey PRIMARY KEY(id);