import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cards Grid: card background mode (default / brand / custom) + brand preset id.
 * Existing background_color values are treated as custom hex.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_bg_mode" AS ENUM('default', 'brand', 'custom');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "bg_mode" "enum_home_page_blocks_cards_grid_items_bg_mode" DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS "brand_background_id" varchar;

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "bg_mode" "enum_home_page_blocks_cards_grid_items_bg_mode" DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS "brand_background_id" varchar;

    UPDATE "home_page_blocks_cards_grid_items"
      SET "bg_mode" = 'custom'
      WHERE "background_color" IS NOT NULL
        AND TRIM("background_color") <> ''
        AND ("bg_mode" IS NULL OR "bg_mode" = 'default');

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "bg_mode" = 'custom'
      WHERE "background_color" IS NOT NULL
        AND TRIM("background_color") <> ''
        AND ("bg_mode" IS NULL OR "bg_mode" = 'default');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "bg_mode",
      DROP COLUMN IF EXISTS "brand_background_id";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "bg_mode",
      DROP COLUMN IF EXISTS "brand_background_id";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_bg_mode";
  `)
}
