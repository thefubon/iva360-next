import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align home page block columns with Payload Drizzle naming.
 * Migration 250000 incorrectly renamed position → image_position (and truncated the enum).
 * Payload expects imageSection.position → image_section_position.
 * Cards grid openInNewTab → btn_open_in_new_tab (not btn_new_tab).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_feature_section'
          AND column_name = 'image_section_image_position'
      ) THEN
        ALTER TABLE "home_page_blocks_feature_section"
          RENAME COLUMN "image_section_image_position" TO "image_section_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_feature_section'
          AND column_name = 'image_section_image_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_feature_section"
          RENAME COLUMN "image_section_image_position" TO "image_section_position";
      END IF;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_image_posit"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_image_position"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'btn_new_tab'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "btn_new_tab" TO "btn_open_in_new_tab";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'btn_new_tab'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "btn_new_tab" TO "btn_open_in_new_tab";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_position"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_image_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_feature_section'
          AND column_name = 'image_section_position'
      ) THEN
        ALTER TABLE "home_page_blocks_feature_section"
          RENAME COLUMN "image_section_position" TO "image_section_image_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_feature_section'
          AND column_name = 'image_section_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_feature_section"
          RENAME COLUMN "image_section_position" TO "image_section_image_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'btn_open_in_new_tab'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "btn_open_in_new_tab" TO "btn_new_tab";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'btn_open_in_new_tab'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "btn_open_in_new_tab" TO "btn_new_tab";
      END IF;
    END $$;
  `)
}
