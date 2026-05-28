import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop columns left over from dev schema push that are no longer in Payload config.
 * Idempotent: safe to re-run.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header_navigation_sub_items"
      DROP COLUMN IF EXISTS "enabled";

    ALTER TABLE "_header_v_version_navigation_sub_items"
      DROP COLUMN IF EXISTS "enabled";

    ALTER TABLE "home_page_blocks_hero"
      DROP CONSTRAINT IF EXISTS "home_page_blocks_hero_headline_section_custom_icon_id_media_id_fk";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP CONSTRAINT IF EXISTS "_home_page_v_blocks_hero_headline_section_custom_icon_id_media_id_fk";

    ALTER TABLE "home_page_blocks_hero"
      DROP COLUMN IF EXISTS "headline_section_icon_type",
      DROP COLUMN IF EXISTS "headline_section_hugeicons_name",
      DROP COLUMN IF EXISTS "headline_section_custom_icon_id";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP COLUMN IF EXISTS "headline_section_icon_type",
      DROP COLUMN IF EXISTS "headline_section_hugeicons_name",
      DROP COLUMN IF EXISTS "headline_section_custom_icon_id";

    ALTER TABLE "home_page_blocks_hero_subscriptions_section_badges"
      DROP COLUMN IF EXISTS "enabled";

    ALTER TABLE "_home_page_v_blocks_hero_subscriptions_section_badges"
      DROP COLUMN IF EXISTS "enabled";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_hero_headline_section_icon_type";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_blocks_hero_headline_section_icon_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_hero_headline_section_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_blocks_hero_headline_section_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "header_navigation_sub_items"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE "_header_v_version_navigation_sub_items"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE "home_page_blocks_hero"
      ADD COLUMN IF NOT EXISTS "headline_section_icon_type" "enum_home_page_blocks_hero_headline_section_icon_type" DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "headline_section_hugeicons_name" varchar,
      ADD COLUMN IF NOT EXISTS "headline_section_custom_icon_id" integer;

    ALTER TABLE "_home_page_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "headline_section_icon_type" "enum__home_page_v_blocks_hero_headline_section_icon_type" DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "headline_section_hugeicons_name" varchar,
      ADD COLUMN IF NOT EXISTS "headline_section_custom_icon_id" integer;

    ALTER TABLE "home_page_blocks_hero_subscriptions_section_badges"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE "_home_page_v_blocks_hero_subscriptions_section_badges"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  `)
}
