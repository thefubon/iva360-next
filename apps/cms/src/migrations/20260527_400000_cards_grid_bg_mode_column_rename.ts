import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align Cards Grid backgroundMode column with Payload Drizzle naming.
 * Migration 390000 used dbName shortcut (bg_mode); Payload expects background_mode.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_bg_mode"
        RENAME TO "enum_home_page_blocks_cards_grid_items_background_mode";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'bg_mode'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "bg_mode" TO "background_mode";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'bg_mode'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "bg_mode" TO "background_mode";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_background_mode"
        RENAME TO "enum_home_page_blocks_cards_grid_items_bg_mode";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'background_mode'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "background_mode" TO "bg_mode";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'background_mode'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "background_mode" TO "bg_mode";
      END IF;
    END $$;
  `)
}
