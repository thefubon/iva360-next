import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align Cards Grid item columns with Payload Drizzle naming.
 * Migrations 310000/320000 used dbName shortcuts (img_pos, padding_left, …);
 * Payload expects group + field names (img_position, padding_padding_left, …).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_pos"
        RENAME TO "enum_home_page_blocks_cards_grid_items_img_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'img_pos'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "img_pos" TO "img_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'img_pos'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "img_pos" TO "img_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_left'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_left" TO "padding_padding_left";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_top'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_top" TO "padding_padding_top";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_right'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_right" TO "padding_padding_right";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_bottom'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_bottom" TO "padding_padding_bottom";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_left'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_left" TO "padding_padding_left";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_top'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_top" TO "padding_padding_top";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_right'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_right" TO "padding_padding_right";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_bottom'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_bottom" TO "padding_padding_bottom";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_position"
        RENAME TO "enum_home_page_blocks_cards_grid_items_img_pos";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'img_position'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "img_position" TO "img_pos";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'img_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "img_position" TO "img_pos";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_padding_left'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_left" TO "padding_left";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_padding_top'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_top" TO "padding_top";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_padding_right'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_right" TO "padding_right";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_cards_grid_items'
          AND column_name = 'padding_padding_bottom'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_bottom" TO "padding_bottom";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_padding_left'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_left" TO "padding_left";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_padding_top'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_top" TO "padding_top";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_padding_right'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_right" TO "padding_right";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_cards_grid_items'
          AND column_name = 'padding_padding_bottom'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          RENAME COLUMN "padding_padding_bottom" TO "padding_bottom";
      END IF;
    END $$;
  `)
}
