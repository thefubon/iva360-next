import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block: optional CTA group (enabled checkbox) and button variant select.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
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
      ADD COLUMN IF NOT EXISTS "cta_variant" "enum_home_page_blocks_hero_cta_variant" DEFAULT 'primary';

    ALTER TABLE "_home_page_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "cta_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cta_variant" "enum__home_page_v_blocks_hero_cta_variant" DEFAULT 'primary';

    UPDATE "home_page_blocks_hero" h
    SET "cta_enabled" = true
    WHERE "cta_enabled" IS NOT TRUE
      AND (
        (h."cta_url" IS NOT NULL AND btrim(h."cta_url") <> '')
        OR EXISTS (
          SELECT 1
          FROM "home_page_blocks_hero_locales" l
          WHERE l."_parent_id" = h."id"
            AND l."cta_label" IS NOT NULL
            AND btrim(l."cta_label") <> ''
        )
      );

    UPDATE "_home_page_v_blocks_hero" h
    SET "cta_enabled" = true
    WHERE "cta_enabled" IS NOT TRUE
      AND (
        (h."cta_url" IS NOT NULL AND btrim(h."cta_url") <> '')
        OR EXISTS (
          SELECT 1
          FROM "_home_page_v_blocks_hero_locales" l
          WHERE l."_parent_id" = h."id"
            AND l."cta_label" IS NOT NULL
            AND btrim(l."cta_label") <> ''
        )
      );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero"
      DROP COLUMN IF EXISTS "cta_enabled",
      DROP COLUMN IF EXISTS "cta_variant";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP COLUMN IF EXISTS "cta_enabled",
      DROP COLUMN IF EXISTS "cta_variant";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_hero_cta_variant";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_blocks_hero_cta_variant";
  `)
}
