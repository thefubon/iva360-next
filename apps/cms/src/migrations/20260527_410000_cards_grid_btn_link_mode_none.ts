import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: btn.linkMode — add «Без кнопки» (none) as default. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'enum_home_page_blocks_cards_grid_items_btn_link_mode'
          AND e.enumlabel = 'none'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'none';
      ELSIF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'enum_home_page_blocks_cards_grid_items_btn_link_mode'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
          RENAME TO "enum_home_page_blocks_cards_grid_items_btn_link_mode_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
          AS ENUM('none', 'button', 'card');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" DROP DEFAULT,
          ALTER COLUMN "btn_link_mode"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            USING "btn_link_mode"::text::"public"."enum_home_page_blocks_cards_grid_items_btn_link_mode",
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" DROP DEFAULT,
          ALTER COLUMN "btn_link_mode"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            USING "btn_link_mode"::text::"public"."enum_home_page_blocks_cards_grid_items_btn_link_mode",
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'none';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode_old";
      ELSE
        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
          AS ENUM('none', 'button', 'card');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ADD COLUMN IF NOT EXISTS "btn_link_mode"
            "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ADD COLUMN IF NOT EXISTS "btn_link_mode"
            "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            DEFAULT 'none';
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'enum_home_page_blocks_cards_grid_items_btn_link_mode'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
          RENAME TO "enum_home_page_blocks_cards_grid_items_btn_link_mode_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
          AS ENUM('button', 'card');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" DROP DEFAULT,
          ALTER COLUMN "btn_link_mode"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            USING (
              CASE
                WHEN "btn_link_mode"::text = 'none' THEN 'button'
                ELSE "btn_link_mode"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_btn_link_mode",
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'button';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "btn_link_mode" DROP DEFAULT,
          ALTER COLUMN "btn_link_mode"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode"
            USING (
              CASE
                WHEN "btn_link_mode"::text = 'none' THEN 'button'
                ELSE "btn_link_mode"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_btn_link_mode",
          ALTER COLUMN "btn_link_mode" SET DEFAULT 'button';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_link_mode_old";
      END IF;
    END $$;
  `)
}
