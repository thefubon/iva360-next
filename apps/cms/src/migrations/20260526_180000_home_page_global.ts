import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the homePage global (page builder with Hero block) and version tables.
 * Idempotent: safe when dev mode already pushed part of the schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('ru', 'en');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "home_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "_status" "enum_home_page_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "cta_url" varchar,
      "background_image_id" integer,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero_locales" (
      "headline" varchar,
      "description" varchar,
      "cta_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "snapshot" boolean,
      "published_locale" "enum__home_page_v_published_locale",
      "latest" boolean,
      "autosave" boolean
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "cta_url" varchar,
      "background_image_id" integer,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero_locales" (
      "headline" varchar,
      "description" varchar,
      "cta_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "home_page__status_idx" ON "home_page" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_order_idx" ON "home_page_blocks_hero" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_parent_id_idx" ON "home_page_blocks_hero" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_path_idx" ON "home_page_blocks_hero" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_background_image_idx" ON "home_page_blocks_hero" USING btree ("background_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_hero_locales_locale_parent_id_unique" ON "home_page_blocks_hero_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
    CREATE INDEX IF NOT EXISTS "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
    CREATE INDEX IF NOT EXISTS "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_order_idx" ON "_home_page_v_blocks_hero" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_parent_id_idx" ON "_home_page_v_blocks_hero" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_path_idx" ON "_home_page_v_blocks_hero" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_background_image_idx" ON "_home_page_v_blocks_hero" USING btree ("background_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_locales_locale_parent_id_unique" ON "_home_page_v_blocks_hero_locales" USING btree ("_locale","_parent_id");

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        ADD CONSTRAINT "home_page_blocks_hero_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        ADD CONSTRAINT "home_page_blocks_hero_background_image_id_media_id_fk"
        FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_locales"
        ADD CONSTRAINT "home_page_blocks_hero_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        ADD CONSTRAINT "_home_page_v_blocks_hero_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        ADD CONSTRAINT "_home_page_v_blocks_hero_background_image_id_media_id_fk"
        FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_locales"
        ADD CONSTRAINT "_home_page_v_blocks_hero_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    INSERT INTO "home_page" ("updated_at", "created_at")
    SELECT NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "home_page");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "home_page_blocks_hero" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;

    DROP TABLE IF EXISTS "home_page_blocks_hero_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_hero" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v" CASCADE;
    DROP TABLE IF EXISTS "home_page" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__home_page_v_published_locale";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_home_page_status";`)
}
