import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: image position (left | right | bottom) in img group. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_pos" AS ENUM('left', 'right', 'bottom');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'bottom';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'bottom';

    UPDATE "home_page_blocks_cards_grid_items"
      SET "img_pos" = 'bottom'
      WHERE "img_pos" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "img_pos" = 'bottom'
      WHERE "img_pos" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_pos";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_pos";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_img_pos";
  `)
}
