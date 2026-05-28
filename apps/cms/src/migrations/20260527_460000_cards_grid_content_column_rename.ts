import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align Cards Grid content columns with Payload Drizzle naming.
 * Migration 450000 used dbName shortcut (content_pos); Payload expects content_position.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_content_pos"
        RENAME TO "enum_home_page_blocks_cards_grid_items_content_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'content_pos'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "content_pos" TO "content_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'content_pos'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "content_pos" TO "content_position";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_content_position"
        RENAME TO "enum_home_page_blocks_cards_grid_items_content_pos";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'content_position'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "content_position" TO "content_pos";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'content_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "content_position" TO "content_pos";
      END IF;
    END $$;
  `)
}
