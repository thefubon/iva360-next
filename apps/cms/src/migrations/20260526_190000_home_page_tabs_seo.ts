import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds Основные / SEO tabs to homePage global: title, SEO fields, og image, noIndex.
 * Idempotent: safe when dev mode already pushed part of the schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;

    ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_og_image_id" integer;
    ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_no_index" boolean DEFAULT false;

    CREATE TABLE IF NOT EXISTS "home_page_locales" (
      "title" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_locales" (
      "version_title" varchar,
      "version_meta_title" varchar,
      "version_meta_description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "home_page_og_image_idx" ON "home_page" USING btree ("og_image_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_version_og_image_idx" ON "_home_page_v" USING btree ("version_og_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");

    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v"
        ADD CONSTRAINT "_home_page_v_version_og_image_id_media_id_fk"
        FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_locales"
        ADD CONSTRAINT "home_page_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_locales"
        ADD CONSTRAINT "_home_page_v_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v_locales" DISABLE ROW LEVEL SECURITY;

    ALTER TABLE "home_page" DROP CONSTRAINT IF EXISTS "home_page_og_image_id_media_id_fk";
    ALTER TABLE "_home_page_v" DROP CONSTRAINT IF EXISTS "_home_page_v_version_og_image_id_media_id_fk";

    DROP TABLE IF EXISTS "home_page_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_locales" CASCADE;

    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "og_image_id";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "no_index";
    ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_og_image_id";
    ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_no_index";`)
}
