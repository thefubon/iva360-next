import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: remove img.bottomSpacing; padding toggles cover spacing. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_bottom_spacing";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_bottom_spacing";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_bottom_spacing" boolean DEFAULT true;

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_bottom_spacing" boolean DEFAULT true;
  `)
}
