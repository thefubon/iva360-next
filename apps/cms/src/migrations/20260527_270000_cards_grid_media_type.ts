import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: mediaType (icon|image) + bottomSpacing; columns 4; drop img.pos. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_columns" ADD VALUE IF NOT EXISTS '4';
    EXCEPTION WHEN undefined_object THEN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_columns" AS ENUM('2', '3', '4');
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type" AS ENUM('icon', 'image');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_media_type" "enum_home_page_blocks_cards_grid_items_img_media_type" DEFAULT 'image',
      ADD COLUMN IF NOT EXISTS "img_bottom_spacing" boolean DEFAULT true;

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_media_type" "enum_home_page_blocks_cards_grid_items_img_media_type" DEFAULT 'image',
      ADD COLUMN IF NOT EXISTS "img_bottom_spacing" boolean DEFAULT true;

    UPDATE "home_page_blocks_cards_grid_items"
      SET "img_media_type" = 'image'
      WHERE "img_media_type" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "img_media_type" = 'image'
      WHERE "img_media_type" IS NULL;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_pos";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_pos";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_img_pos";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_pos" AS ENUM('left', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'right';

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'right';

    UPDATE "home_page_blocks_cards_grid_items"
      SET "img_pos" = 'right'
      WHERE "img_pos" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "img_pos" = 'right'
      WHERE "img_pos" IS NULL;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_media_type",
      DROP COLUMN IF EXISTS "img_bottom_spacing";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "img_media_type",
      DROP COLUMN IF EXISTS "img_bottom_spacing";

    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_img_media_type";
  `)
}
