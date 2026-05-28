import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: img.imageAlign (top | bottom | stretch) — Payload column img_image_align. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_image_align" AS ENUM('top', 'bottom', 'stretch');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_image_align" "enum_home_page_blocks_cards_grid_items_img_image_align" DEFAULT 'top';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_image_align" "enum_home_page_blocks_cards_grid_items_img_image_align" DEFAULT 'top';

    UPDATE "home_page_blocks_cards_grid_items"
      SET "img_image_align" = 'top'
      WHERE "img_image_align" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "img_image_align" = 'top'
      WHERE "img_image_align" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_image_align";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_image_align";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_img_image_align";
  `)
}
