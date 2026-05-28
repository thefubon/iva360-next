import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: btn.linkMode — button in card vs entire card as link. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode" AS ENUM('button', 'card');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "btn_link_mode" "enum_home_page_blocks_cards_grid_items_btn_link_mode" DEFAULT 'button';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "btn_link_mode" "enum_home_page_blocks_cards_grid_items_btn_link_mode" DEFAULT 'button';

    UPDATE "home_page_blocks_cards_grid_items"
      SET "btn_link_mode" = 'button'
      WHERE "btn_link_mode" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "btn_link_mode" = 'button'
      WHERE "btn_link_mode" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "btn_link_mode";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "btn_link_mode";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode";
  `)
}
