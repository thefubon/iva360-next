import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Hero block: group sections for admin UI (description, buttons, image). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      RENAME COLUMN "description" TO "description_section_description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      RENAME COLUMN "description" TO "description_section_description";

    ALTER TABLE "home_page_blocks_hero"
      RENAME COLUMN "image_id" TO "image_section_image_id";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_image_idx"
      RENAME TO "home_page_blocks_hero_image_section_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        RENAME CONSTRAINT "home_page_blocks_hero_image_id_media_id_fk"
        TO "home_page_blocks_hero_image_section_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_hero"
      RENAME COLUMN "image_id" TO "image_section_image_id";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_image_idx"
      RENAME TO "_home_page_v_blocks_hero_image_section_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_image_id_media_id_fk"
        TO "_home_page_v_blocks_hero_image_section_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_hero_buttons"
      RENAME TO "home_page_blocks_hero_buttons_section_buttons";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_buttons_order_idx"
      RENAME TO "home_page_blocks_hero_buttons_section_buttons_order_idx";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_buttons_parent_id_idx"
      RENAME TO "home_page_blocks_hero_buttons_section_buttons_parent_id_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_buttons_section_buttons"
        RENAME CONSTRAINT "home_page_blocks_hero_buttons_parent_id_fk"
        TO "home_page_blocks_hero_buttons_section_buttons_parent_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_hero_buttons_locales"
      RENAME TO "home_page_blocks_hero_buttons_section_buttons_locales";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_buttons_section_buttons_locales"
        RENAME CONSTRAINT "home_page_blocks_hero_buttons_locales_parent_id_fk"
        TO "home_page_blocks_hero_buttons_section_buttons_locales_parent_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER INDEX IF EXISTS "home_page_blocks_hero_buttons_locales_locale_parent_id_unique"
      RENAME TO "home_page_blocks_hero_buttons_section_buttons_locales_locale_parent_id_unique";

    ALTER TABLE "_home_page_v_blocks_hero_buttons"
      RENAME TO "_home_page_v_blocks_hero_buttons_section_buttons";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_buttons_order_idx"
      RENAME TO "_home_page_v_blocks_hero_buttons_section_buttons_order_idx";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_buttons_parent_id_idx"
      RENAME TO "_home_page_v_blocks_hero_buttons_section_buttons_parent_id_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_buttons_section_buttons"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_buttons_parent_id_fk"
        TO "_home_page_v_blocks_hero_buttons_section_buttons_parent_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_hero_buttons_locales"
      RENAME TO "_home_page_v_blocks_hero_buttons_section_buttons_locales";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_buttons_section_buttons_locales"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_buttons_locales_parent_id_fk"
        TO "_home_page_v_blocks_hero_buttons_section_buttons_locales_parent_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_buttons_locales_locale_parent_id_unique"
      RENAME TO "_home_page_v_blocks_hero_buttons_section_buttons_locales_locale_parent_id_unique";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      RENAME COLUMN "description_section_description" TO "description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      RENAME COLUMN "description_section_description" TO "description";

    ALTER TABLE "home_page_blocks_hero"
      RENAME COLUMN "image_section_image_id" TO "image_id";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_image_section_image_idx"
      RENAME TO "home_page_blocks_hero_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        RENAME CONSTRAINT "home_page_blocks_hero_image_section_image_id_media_id_fk"
        TO "home_page_blocks_hero_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_hero"
      RENAME COLUMN "image_section_image_id" TO "image_id";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_image_section_image_idx"
      RENAME TO "_home_page_v_blocks_hero_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_image_section_image_id_media_id_fk"
        TO "_home_page_v_blocks_hero_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_hero_buttons_section_buttons"
      RENAME TO "home_page_blocks_hero_buttons";

    ALTER TABLE "home_page_blocks_hero_buttons_section_buttons_locales"
      RENAME TO "home_page_blocks_hero_buttons_locales";

    ALTER TABLE "_home_page_v_blocks_hero_buttons_section_buttons"
      RENAME TO "_home_page_v_blocks_hero_buttons";

    ALTER TABLE "_home_page_v_blocks_hero_buttons_section_buttons_locales"
      RENAME TO "_home_page_v_blocks_hero_buttons_locales";
  `)
}
