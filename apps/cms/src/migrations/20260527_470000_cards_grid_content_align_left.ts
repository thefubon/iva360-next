import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cards Grid: replace 'right' with 'left' in content align enum; default left.
 * Uses enum recreation (not ADD VALUE) to avoid PG "unsafe use of new value" in one transaction.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'enum_home_page_blocks_cards_grid_items_content_align'
          AND e.enumlabel = 'right'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
          RENAME TO "enum_home_page_blocks_cards_grid_items_content_align_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
          AS ENUM('left', 'center');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "content_align" DROP DEFAULT,
          ALTER COLUMN "content_align"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
            USING (
              CASE
                WHEN "content_align"::text = 'right' THEN 'left'
                ELSE "content_align"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_content_align",
          ALTER COLUMN "content_align" SET DEFAULT 'left';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "content_align" DROP DEFAULT,
          ALTER COLUMN "content_align"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
            USING (
              CASE
                WHEN "content_align"::text = 'right' THEN 'left'
                ELSE "content_align"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_content_align",
          ALTER COLUMN "content_align" SET DEFAULT 'left';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align_old";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'enum_home_page_blocks_cards_grid_items_content_align'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
          RENAME TO "enum_home_page_blocks_cards_grid_items_content_align_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
          AS ENUM('right', 'center');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "content_align" DROP DEFAULT,
          ALTER COLUMN "content_align"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
            USING (
              CASE
                WHEN "content_align"::text = 'left' THEN 'right'
                ELSE "content_align"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_content_align",
          ALTER COLUMN "content_align" SET DEFAULT 'right';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "content_align" DROP DEFAULT,
          ALTER COLUMN "content_align"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align"
            USING (
              CASE
                WHEN "content_align"::text = 'left' THEN 'right'
                ELSE "content_align"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_content_align",
          ALTER COLUMN "content_align" SET DEFAULT 'right';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_content_align_old";
      END IF;
    END $$;
  `)
}
