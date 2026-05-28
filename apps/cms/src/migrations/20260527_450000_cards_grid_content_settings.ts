import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cards Grid: content group — contentAlign (right | center), contentPosition (top | center).
 * Payload columns: content_align, content_pos (dbName on fields to stay under PG 63-char limit).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align" AS ENUM('right', 'center');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_content_pos" AS ENUM('top', 'center');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "content_align" "enum_home_page_blocks_cards_grid_items_content_align" DEFAULT 'right',
      ADD COLUMN IF NOT EXISTS "content_pos" "enum_home_page_blocks_cards_grid_items_content_pos" DEFAULT 'top';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "content_align" "enum_home_page_blocks_cards_grid_items_content_align" DEFAULT 'right',
      ADD COLUMN IF NOT EXISTS "content_pos" "enum_home_page_blocks_cards_grid_items_content_pos" DEFAULT 'top';

    UPDATE "home_page_blocks_cards_grid_items"
      SET
        "content_align" = 'right',
        "content_pos" = 'top'
      WHERE "content_align" IS NULL OR "content_pos" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET
        "content_align" = 'right',
        "content_pos" = 'top'
      WHERE "content_align" IS NULL OR "content_pos" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "content_align",
      DROP COLUMN IF EXISTS "content_pos";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "content_align",
      DROP COLUMN IF EXISTS "content_pos";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_content_align";
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_content_pos";
  `)
}
