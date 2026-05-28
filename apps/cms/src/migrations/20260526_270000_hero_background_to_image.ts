import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Hero block: side image field (renamed from backgroundImage). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero"
      RENAME COLUMN "background_image_id" TO "image_id";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_background_image_idx"
      RENAME TO "home_page_blocks_hero_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        RENAME CONSTRAINT "home_page_blocks_hero_background_image_id_media_id_fk"
        TO "home_page_blocks_hero_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_hero"
      RENAME COLUMN "background_image_id" TO "image_id";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_background_image_idx"
      RENAME TO "_home_page_v_blocks_hero_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_background_image_id_media_id_fk"
        TO "_home_page_v_blocks_hero_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero"
      RENAME COLUMN "image_id" TO "background_image_id";

    ALTER INDEX IF EXISTS "home_page_blocks_hero_image_idx"
      RENAME TO "home_page_blocks_hero_background_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero"
        RENAME CONSTRAINT "home_page_blocks_hero_image_id_media_id_fk"
        TO "home_page_blocks_hero_background_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_hero"
      RENAME COLUMN "image_id" TO "background_image_id";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_hero_image_idx"
      RENAME TO "_home_page_v_blocks_hero_background_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero"
        RENAME CONSTRAINT "_home_page_v_blocks_hero_image_id_media_id_fk"
        TO "_home_page_v_blocks_hero_background_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}
