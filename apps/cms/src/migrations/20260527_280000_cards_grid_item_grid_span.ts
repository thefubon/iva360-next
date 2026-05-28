import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: per-card grid column span (1 | 2 | full). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_grid_span" AS ENUM('1', '2', 'full');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "grid_span" "enum_home_page_blocks_cards_grid_items_grid_span" DEFAULT '1';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "grid_span" "enum_home_page_blocks_cards_grid_items_grid_span" DEFAULT '1';

    UPDATE "home_page_blocks_cards_grid_items"
      SET "grid_span" = '1'
      WHERE "grid_span" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "grid_span" = '1'
      WHERE "grid_span" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "grid_span";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "grid_span";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_grid_span";
  `)
}
