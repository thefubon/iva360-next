import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: per-card padding toggles (left | top | right | bottom). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "padding_left" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_top" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_right" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_bottom" boolean DEFAULT true;

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "padding_left" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_top" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_right" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "padding_bottom" boolean DEFAULT true;

    UPDATE "home_page_blocks_cards_grid_items"
      SET
        "padding_left" = true,
        "padding_top" = true,
        "padding_right" = true,
        "padding_bottom" = true
      WHERE
        "padding_left" IS NULL
        OR "padding_top" IS NULL
        OR "padding_right" IS NULL
        OR "padding_bottom" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET
        "padding_left" = true,
        "padding_top" = true,
        "padding_right" = true,
        "padding_bottom" = true
      WHERE
        "padding_left" IS NULL
        OR "padding_top" IS NULL
        OR "padding_right" IS NULL
        OR "padding_bottom" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "padding_left",
      DROP COLUMN IF EXISTS "padding_top",
      DROP COLUMN IF EXISTS "padding_right",
      DROP COLUMN IF EXISTS "padding_bottom";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "padding_left",
      DROP COLUMN IF EXISTS "padding_top",
      DROP COLUMN IF EXISTS "padding_right",
      DROP COLUMN IF EXISTS "padding_bottom";
  `)
}
