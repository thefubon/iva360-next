import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align Cards Grid imageAlign column with Payload Drizzle naming.
 * Migration 430000 used img group + dbName (img_align); Payload expects img_image_align.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_align"
        RENAME TO "enum_home_page_blocks_cards_grid_items_img_image_align";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'img_align'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "img_align" TO "img_image_align";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'img_align'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "img_align" TO "img_image_align";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_image_align"
        RENAME TO "enum_home_page_blocks_cards_grid_items_img_align";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'img_image_align'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "img_image_align" TO "img_align";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'img_image_align'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "img_image_align" TO "img_align";
      END IF;
    END $$;
  `)
}
