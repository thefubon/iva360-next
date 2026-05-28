import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "header_navigation_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS "header_navigation_sub_items_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  ALTER TABLE "topbar_phones" ALTER COLUMN "hugeicons_name" SET DEFAULT 'Call02Icon';
  ALTER TABLE "topbar_right_links" ALTER COLUMN "hugeicons_name" SET DEFAULT 'CustomerSupportIcon';
  ALTER TABLE "header_navigation" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "header_navigation" ADD COLUMN IF NOT EXISTS "open_in_new_tab" boolean DEFAULT false;

  DO $$ BEGIN
    ALTER TABLE "header_navigation_sub_items"
      ADD CONSTRAINT "header_navigation_sub_items_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "header_navigation_sub_items"
      ADD CONSTRAINT "header_navigation_sub_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "header_navigation_sub_items_locales"
      ADD CONSTRAINT "header_navigation_sub_items_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation_sub_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  CREATE INDEX IF NOT EXISTS "header_navigation_sub_items_order_idx" ON "header_navigation_sub_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_sub_items_parent_id_idx" ON "header_navigation_sub_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_sub_items_icon_idx" ON "header_navigation_sub_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "header_navigation_sub_items_locales_locale_parent_id_unique" ON "header_navigation_sub_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navigation_sub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_navigation_sub_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_navigation_sub_items" CASCADE;
  DROP TABLE "header_navigation_sub_items_locales" CASCADE;
  ALTER TABLE "topbar_phones" ALTER COLUMN "hugeicons_name" SET DEFAULT 'CallIcon';
  ALTER TABLE "topbar_right_links" ALTER COLUMN "hugeicons_name" SET DEFAULT 'CallIcon';
  ALTER TABLE "header_navigation" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "header_navigation" DROP COLUMN IF EXISTS "open_in_new_tab";`)
}
