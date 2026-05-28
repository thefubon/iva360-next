import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block: nest headline under headlineSection group; add optional Hugeicons/custom icon fields.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_hero_headline_section_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__home_page_v_blocks_hero_headline_section_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_hero"
      ADD COLUMN IF NOT EXISTS "headline_section_icon_type" "enum_home_page_blocks_hero_headline_section_icon_type" DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "headline_section_hugeicons_name" varchar,
      ADD COLUMN IF NOT EXISTS "headline_section_custom_icon_id" integer;

    ALTER TABLE "_home_page_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "headline_section_icon_type" "enum__home_page_v_blocks_hero_headline_section_icon_type" DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "headline_section_hugeicons_name" varchar,
      ADD COLUMN IF NOT EXISTS "headline_section_custom_icon_id" integer;

    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "headline_section_headline" varchar;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "headline_section_headline" varchar;

    UPDATE "home_page_blocks_hero_locales"
    SET "headline_section_headline" = "headline"
    WHERE "headline" IS NOT NULL
      AND ("headline_section_headline" IS NULL OR "headline_section_headline" = '');

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "headline_section_headline" = "headline"
    WHERE "headline" IS NOT NULL
      AND ("headline_section_headline" IS NULL OR "headline_section_headline" = '');

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "headline";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "headline";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        ADD CONSTRAINT "home_page_blocks_hero_headline_section_custom_icon_id_media_id_fk"
        FOREIGN KEY ("headline_section_custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        ADD CONSTRAINT "_home_page_v_blocks_hero_headline_section_custom_icon_id_media_id_fk"
        FOREIGN KEY ("headline_section_custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "headline" varchar;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "headline" varchar;

    UPDATE "home_page_blocks_hero_locales"
    SET "headline" = "headline_section_headline"
    WHERE "headline_section_headline" IS NOT NULL;

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "headline" = "headline_section_headline"
    WHERE "headline_section_headline" IS NOT NULL;

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "headline_section_headline";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "headline_section_headline";

    ALTER TABLE "home_page_blocks_hero" DROP CONSTRAINT IF EXISTS "home_page_blocks_hero_headline_section_custom_icon_id_media_id_fk";
    ALTER TABLE "_home_page_v_blocks_hero" DROP CONSTRAINT IF EXISTS "_home_page_v_blocks_hero_headline_section_custom_icon_id_media_id_fk";

    ALTER TABLE "home_page_blocks_hero"
      DROP COLUMN IF EXISTS "headline_section_icon_type",
      DROP COLUMN IF EXISTS "headline_section_hugeicons_name",
      DROP COLUMN IF EXISTS "headline_section_custom_icon_id";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP COLUMN IF EXISTS "headline_section_icon_type",
      DROP COLUMN IF EXISTS "headline_section_hugeicons_name",
      DROP COLUMN IF EXISTS "headline_section_custom_icon_id";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_hero_headline_section_icon_type";
    DROP TYPE IF EXISTS "public"."enum__home_page_v_blocks_hero_headline_section_icon_type";
  `)
}
