import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds draft/version support for header and footer globals (Live Preview).
 * Idempotent: safe when dev mode already pushed part of the schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_header_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_footer_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__header_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__header_v_published_locale" AS ENUM ('ru', 'en');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__header_v_version_phones_icon_type" AS ENUM ('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__header_v_version_right_links_icon_type" AS ENUM ('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__footer_v_published_locale" AS ENUM ('ru', 'en');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__footer_v_version_social_links_platform" AS ENUM ('vk', 'telegram', 'youtube', 'other');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "_status" "enum_header_status" DEFAULT 'draft';
    ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "_status" "enum_footer_status" DEFAULT 'draft';

    CREATE TABLE IF NOT EXISTS "_header_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_logo_id" integer,
      "version__status" "enum__header_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "snapshot" boolean,
      "published_locale" "enum__header_v_published_locale",
      "latest" boolean,
      "autosave" boolean
    );

    CREATE TABLE IF NOT EXISTS "_header_v_locales" (
      "version_site_name" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "mobile_menu_only" boolean DEFAULT false,
      "url" varchar,
      "open_in_new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_navigation_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_navigation_sub_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "url" varchar,
      "open_in_new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_navigation_sub_items_locales" (
      "label" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_phones" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "open_in_new_tab" boolean DEFAULT false,
      "icon_type" "enum__header_v_version_phones_icon_type" DEFAULT 'hugeicons',
      "hugeicons_name" varchar DEFAULT 'Call02Icon',
      "custom_icon_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_phones_locales" (
      "number" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_right_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "open_in_new_tab" boolean DEFAULT false,
      "icon_type" "enum__header_v_version_right_links_icon_type" DEFAULT 'hugeicons',
      "hugeicons_name" varchar DEFAULT 'CustomerSupportIcon',
      "custom_icon_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_header_v_version_right_links_locales" (
      "number" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_footer_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_contact_email" varchar,
      "version_contact_phone" varchar,
      "version__status" "enum__footer_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "snapshot" boolean,
      "published_locale" "enum__footer_v_published_locale",
      "latest" boolean,
      "autosave" boolean
    );

    CREATE TABLE IF NOT EXISTS "_footer_v_locales" (
      "version_copyright" varchar,
      "version_contact_address" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_links_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_footer_v_version_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "platform" "enum__footer_v_version_social_links_platform",
      "url" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_footer_v_published_locale_idx" ON "_footer_v" USING btree ("published_locale");
    CREATE INDEX IF NOT EXISTS "_footer_v_snapshot_idx" ON "_footer_v" USING btree ("snapshot");
    CREATE INDEX IF NOT EXISTS "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_footer_v_version_links_order_idx" ON "_footer_v_version_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_footer_v_version_links_parent_id_idx" ON "_footer_v_version_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_footer_v_version_social_links_order_idx" ON "_footer_v_version_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_footer_v_version_social_links_parent_id_idx" ON "_footer_v_version_social_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_header_v_autosave_idx" ON "_header_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_header_v_latest_idx" ON "_header_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_header_v_published_locale_idx" ON "_header_v" USING btree ("published_locale");
    CREATE INDEX IF NOT EXISTS "_header_v_snapshot_idx" ON "_header_v" USING btree ("snapshot");
    CREATE INDEX IF NOT EXISTS "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_icon_idx" ON "_header_v_version_navigation" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_order_idx" ON "_header_v_version_navigation" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_parent_id_idx" ON "_header_v_version_navigation" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_sub_items_icon_idx" ON "_header_v_version_navigation_sub_items" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_sub_items_order_idx" ON "_header_v_version_navigation_sub_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_header_v_version_navigation_sub_items_parent_id_idx" ON "_header_v_version_navigation_sub_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_phones_custom_icon_idx" ON "_header_v_version_phones" USING btree ("custom_icon_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_phones_order_idx" ON "_header_v_version_phones" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_header_v_version_phones_parent_id_idx" ON "_header_v_version_phones" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_right_links_custom_icon_idx" ON "_header_v_version_right_links" USING btree ("custom_icon_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_right_links_order_idx" ON "_header_v_version_right_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_header_v_version_right_links_parent_id_idx" ON "_header_v_version_right_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_header_v_version_version__status_idx" ON "_header_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_header_v_version_version_logo_idx" ON "_header_v" USING btree ("version_logo_id");
    CREATE INDEX IF NOT EXISTS "footer__status_idx" ON "footer" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "header__status_idx" ON "header" USING btree ("_status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_header_v_version_right_links_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_right_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_phones_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_phones" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_navigation_sub_items_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_navigation_sub_items" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_navigation_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_version_navigation" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_header_v" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_footer_v_version_social_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_footer_v_version_links_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_footer_v_version_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_footer_v_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_footer_v" DISABLE ROW LEVEL SECURITY;

    DROP TABLE IF EXISTS "_header_v_version_right_links_locales" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_right_links" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_phones_locales" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_phones" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_navigation_sub_items_locales" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_navigation_sub_items" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_navigation_locales" CASCADE;
    DROP TABLE IF EXISTS "_header_v_version_navigation" CASCADE;
    DROP TABLE IF EXISTS "_header_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_header_v" CASCADE;
    DROP TABLE IF EXISTS "_footer_v_version_social_links" CASCADE;
    DROP TABLE IF EXISTS "_footer_v_version_links_locales" CASCADE;
    DROP TABLE IF EXISTS "_footer_v_version_links" CASCADE;
    DROP TABLE IF EXISTS "_footer_v_locales" CASCADE;
    DROP TABLE IF EXISTS "_footer_v" CASCADE;

    ALTER TABLE "header" DROP COLUMN IF EXISTS "_status";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "_status";

    DROP TYPE IF EXISTS "public"."enum__footer_v_version_social_links_platform";
    DROP TYPE IF EXISTS "public"."enum__footer_v_published_locale";
    DROP TYPE IF EXISTS "public"."enum__footer_v_version_status";
    DROP TYPE IF EXISTS "public"."enum__header_v_version_right_links_icon_type";
    DROP TYPE IF EXISTS "public"."enum__header_v_version_phones_icon_type";
    DROP TYPE IF EXISTS "public"."enum__header_v_published_locale";
    DROP TYPE IF EXISTS "public"."enum__header_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_footer_status";
    DROP TYPE IF EXISTS "public"."enum_header_status";
  `)
}
