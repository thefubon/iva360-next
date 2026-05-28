import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block: replace single CTA group with buttons array (max 2).
 * Migrates existing enabled CTA data into the first array row.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_hero_buttons_variant" AS ENUM('primary', 'outline', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_blocks_hero_buttons_variant" AS ENUM('primary', 'outline', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero_buttons" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "variant" "enum_home_page_blocks_hero_buttons_variant" DEFAULT 'primary',
      "open_in_new_tab" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero_buttons_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero_buttons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "variant" "enum__home_page_v_blocks_hero_buttons_variant" DEFAULT 'primary',
      "open_in_new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero_buttons_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_buttons"
        ADD CONSTRAINT "home_page_blocks_hero_buttons_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_buttons_locales"
        ADD CONSTRAINT "home_page_blocks_hero_buttons_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero_buttons"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_buttons"
        ADD CONSTRAINT "_home_page_v_blocks_hero_buttons_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_buttons_locales"
        ADD CONSTRAINT "_home_page_v_blocks_hero_buttons_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero_buttons"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_buttons_order_idx" ON "home_page_blocks_hero_buttons" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_buttons_parent_id_idx" ON "home_page_blocks_hero_buttons" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_hero_buttons_locales_locale_parent_id_unique" ON "home_page_blocks_hero_buttons_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_buttons_order_idx" ON "_home_page_v_blocks_hero_buttons" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_buttons_parent_id_idx" ON "_home_page_v_blocks_hero_buttons" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_buttons_locales_locale_parent_id_unique" ON "_home_page_v_blocks_hero_buttons_locales" USING btree ("_locale","_parent_id");

    INSERT INTO "home_page_blocks_hero_buttons" ("_order", "_parent_id", "id", "url", "variant", "open_in_new_tab")
    SELECT
      0,
      h."id",
      'migrated-cta-' || h."id",
      h."cta_url",
      COALESCE(h."cta_variant"::text, 'primary')::"enum_home_page_blocks_hero_buttons_variant",
      COALESCE(h."cta_open_in_new_tab", false)
    FROM "home_page_blocks_hero" h
    WHERE NOT EXISTS (
      SELECT 1 FROM "home_page_blocks_hero_buttons" b WHERE b."_parent_id" = h."id"
    )
    AND (
      h."cta_enabled" IS TRUE
      OR (h."cta_url" IS NOT NULL AND btrim(h."cta_url") <> '')
      OR EXISTS (
        SELECT 1
        FROM "home_page_blocks_hero_locales" l
        WHERE l."_parent_id" = h."id"
          AND l."cta_label" IS NOT NULL
          AND btrim(l."cta_label") <> ''
      )
    );

    INSERT INTO "home_page_blocks_hero_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT
      l."cta_label",
      l."_locale",
      'migrated-cta-' || l."_parent_id"
    FROM "home_page_blocks_hero_locales" l
    WHERE l."cta_label" IS NOT NULL
      AND btrim(l."cta_label") <> ''
      AND EXISTS (
        SELECT 1
        FROM "home_page_blocks_hero_buttons" b
        WHERE b."id" = 'migrated-cta-' || l."_parent_id"
      )
      AND NOT EXISTS (
        SELECT 1
        FROM "home_page_blocks_hero_buttons_locales" bl
        WHERE bl."_parent_id" = 'migrated-cta-' || l."_parent_id"
          AND bl."_locale" = l."_locale"
      );

    INSERT INTO "_home_page_v_blocks_hero_buttons" ("_order", "_parent_id", "url", "variant", "open_in_new_tab", "_uuid")
    SELECT
      0,
      h."id",
      h."cta_url",
      COALESCE(h."cta_variant"::text, 'primary')::"enum__home_page_v_blocks_hero_buttons_variant",
      COALESCE(h."cta_open_in_new_tab", false),
      'migrated-cta-v-' || h."id"::text
    FROM "_home_page_v_blocks_hero" h
    WHERE NOT EXISTS (
      SELECT 1 FROM "_home_page_v_blocks_hero_buttons" b WHERE b."_parent_id" = h."id"
    )
    AND (
      h."cta_enabled" IS TRUE
      OR (h."cta_url" IS NOT NULL AND btrim(h."cta_url") <> '')
      OR EXISTS (
        SELECT 1
        FROM "_home_page_v_blocks_hero_locales" l
        WHERE l."_parent_id" = h."id"
          AND l."cta_label" IS NOT NULL
          AND btrim(l."cta_label") <> ''
      )
    );

    INSERT INTO "_home_page_v_blocks_hero_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT
      l."cta_label",
      l."_locale",
      b."id"
    FROM "_home_page_v_blocks_hero_locales" l
    JOIN "_home_page_v_blocks_hero_buttons" b
      ON b."_parent_id" = l."_parent_id"
      AND b."_uuid" = 'migrated-cta-v-' || l."_parent_id"::text
    WHERE l."cta_label" IS NOT NULL
      AND btrim(l."cta_label") <> ''
      AND NOT EXISTS (
        SELECT 1
        FROM "_home_page_v_blocks_hero_buttons_locales" bl
        WHERE bl."_parent_id" = b."id"
          AND bl."_locale" = l."_locale"
      );

    ALTER TABLE "home_page_blocks_hero"
      DROP COLUMN IF EXISTS "cta_enabled",
      DROP COLUMN IF EXISTS "cta_variant",
      DROP COLUMN IF EXISTS "cta_open_in_new_tab",
      DROP COLUMN IF EXISTS "cta_url";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP COLUMN IF EXISTS "cta_enabled",
      DROP COLUMN IF EXISTS "cta_variant",
      DROP COLUMN IF EXISTS "cta_open_in_new_tab",
      DROP COLUMN IF EXISTS "cta_url";

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "cta_label";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "cta_label";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_hero_cta_variant";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_blocks_hero_cta_variant";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_hero_cta_variant" AS ENUM('primary', 'outline', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_blocks_hero_cta_variant" AS ENUM('primary', 'outline', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_hero"
      ADD COLUMN IF NOT EXISTS "cta_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cta_variant" "enum_home_page_blocks_hero_cta_variant" DEFAULT 'primary',
      ADD COLUMN IF NOT EXISTS "cta_open_in_new_tab" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cta_url" varchar;

    ALTER TABLE "_home_page_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "cta_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cta_variant" "enum__home_page_v_blocks_hero_cta_variant" DEFAULT 'primary',
      ADD COLUMN IF NOT EXISTS "cta_open_in_new_tab" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cta_url" varchar;

    ALTER TABLE "home_page_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
    ALTER TABLE "_home_page_v_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "cta_label" varchar;

    UPDATE "home_page_blocks_hero" h
    SET
      "cta_enabled" = true,
      "cta_url" = b."url",
      "cta_variant" = b."variant"::text::"enum_home_page_blocks_hero_cta_variant",
      "cta_open_in_new_tab" = b."open_in_new_tab"
    FROM "home_page_blocks_hero_buttons" b
    WHERE b."_parent_id" = h."id"
      AND b."_order" = (
        SELECT MIN(b2."_order")
        FROM "home_page_blocks_hero_buttons" b2
        WHERE b2."_parent_id" = h."id"
      );

    UPDATE "home_page_blocks_hero_locales" l
    SET "cta_label" = bl."label"
    FROM "home_page_blocks_hero_buttons" b
    JOIN "home_page_blocks_hero_buttons_locales" bl ON bl."_parent_id" = b."id"
    WHERE b."_parent_id" = l."_parent_id"
      AND bl."_locale" = l."_locale"
      AND b."_order" = (
        SELECT MIN(b2."_order")
        FROM "home_page_blocks_hero_buttons" b2
        WHERE b2."_parent_id" = l."_parent_id"
      );

    UPDATE "_home_page_v_blocks_hero" h
    SET
      "cta_enabled" = true,
      "cta_url" = b."url",
      "cta_variant" = b."variant"::text::"enum__home_page_v_blocks_hero_cta_variant",
      "cta_open_in_new_tab" = b."open_in_new_tab"
    FROM "_home_page_v_blocks_hero_buttons" b
    WHERE b."_parent_id" = h."id"
      AND b."_order" = (
        SELECT MIN(b2."_order")
        FROM "_home_page_v_blocks_hero_buttons" b2
        WHERE b2."_parent_id" = h."id"
      );

    UPDATE "_home_page_v_blocks_hero_locales" l
    SET "cta_label" = bl."label"
    FROM "_home_page_v_blocks_hero_buttons" b
    JOIN "_home_page_v_blocks_hero_buttons_locales" bl ON bl."_parent_id" = b."id"
    WHERE b."_parent_id" = l."_parent_id"
      AND bl."_locale" = l."_locale"
      AND b."_order" = (
        SELECT MIN(b2."_order")
        FROM "_home_page_v_blocks_hero_buttons" b2
        WHERE b2."_parent_id" = l."_parent_id"
      );

    ALTER TABLE "home_page_blocks_hero_buttons_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "home_page_blocks_hero_buttons" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v_blocks_hero_buttons_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_home_page_v_blocks_hero_buttons" DISABLE ROW LEVEL SECURITY;

    DROP TABLE IF EXISTS "home_page_blocks_hero_buttons_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_hero_buttons" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero_buttons_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero_buttons" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_hero_buttons_variant";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_blocks_hero_buttons_variant";
  `)
}
