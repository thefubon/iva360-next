import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cards Grid: drop redundant item.icon — media is stored in img.image + img.mediaType.
 * Migrates legacy icon_id into img_image_id when img is empty.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page_blocks_cards_grid_items"
      SET
        "img_image_id" = "icon_id",
        "img_media_type" = 'icon'
      WHERE "icon_id" IS NOT NULL
        AND "img_image_id" IS NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET
        "img_image_id" = "icon_id",
        "img_media_type" = 'icon'
      WHERE "icon_id" IS NOT NULL
        AND "img_image_id" IS NULL;

    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP CONSTRAINT IF EXISTS "home_page_blocks_cards_grid_items_icon_id_media_id_fk";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP CONSTRAINT IF EXISTS "_home_page_v_blocks_cards_grid_items_icon_id_media_id_fk";

    DROP INDEX IF EXISTS "home_page_blocks_cards_grid_items_icon_idx";
    DROP INDEX IF EXISTS "_home_page_v_blocks_cards_grid_items_icon_idx";

    ALTER TABLE "home_page_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "icon_id";

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      DROP COLUMN IF EXISTS "icon_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "icon_id" integer;

    ALTER TABLE "_home_page_v_blocks_cards_grid_items"
      ADD COLUMN IF NOT EXISTS "icon_id" integer;

    UPDATE "home_page_blocks_cards_grid_items"
      SET "icon_id" = "img_image_id"
      WHERE "img_media_type" = 'icon'
        AND "img_image_id" IS NOT NULL;

    UPDATE "_home_page_v_blocks_cards_grid_items"
      SET "icon_id" = "img_image_id"
      WHERE "img_media_type" = 'icon'
        AND "img_image_id" IS NOT NULL;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid_items"
        ADD CONSTRAINT "home_page_blocks_cards_grid_items_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid_items"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_items_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_icon_idx"
      ON "home_page_blocks_cards_grid_items" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_icon_idx"
      ON "_home_page_v_blocks_cards_grid_items" USING btree ("icon_id");
  `)
}
