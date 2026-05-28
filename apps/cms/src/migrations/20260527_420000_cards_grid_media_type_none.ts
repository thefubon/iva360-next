import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: img.mediaType — add «Без картинки» (none) as default. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'enum_home_page_blocks_cards_grid_items_img_media_type'
          AND e.enumlabel = 'none'
      ) THEN
        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" SET DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" SET DEFAULT 'none';
      ELSIF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'enum_home_page_blocks_cards_grid_items_img_media_type'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
          RENAME TO "enum_home_page_blocks_cards_grid_items_img_media_type_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
          AS ENUM('none', 'icon', 'image');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" DROP DEFAULT,
          ALTER COLUMN "img_media_type"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
            USING "img_media_type"::text::"public"."enum_home_page_blocks_cards_grid_items_img_media_type",
          ALTER COLUMN "img_media_type" SET DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" DROP DEFAULT,
          ALTER COLUMN "img_media_type"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
            USING "img_media_type"::text::"public"."enum_home_page_blocks_cards_grid_items_img_media_type",
          ALTER COLUMN "img_media_type" SET DEFAULT 'none';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type_old";
      ELSE
        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
          AS ENUM('none', 'icon', 'image');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ADD COLUMN IF NOT EXISTS "img_media_type"
            "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
            DEFAULT 'none';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ADD COLUMN IF NOT EXISTS "img_media_type"
            "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
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
        WHERE typname = 'enum_home_page_blocks_cards_grid_items_img_media_type'
      ) THEN
        ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
          RENAME TO "enum_home_page_blocks_cards_grid_items_img_media_type_old";

        CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
          AS ENUM('icon', 'image');

        ALTER TABLE "home_page_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" DROP DEFAULT,
          ALTER COLUMN "img_media_type"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
            USING (
              CASE
                WHEN "img_media_type"::text = 'none' THEN 'image'
                ELSE "img_media_type"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_img_media_type",
          ALTER COLUMN "img_media_type" SET DEFAULT 'image';

        ALTER TABLE "_home_page_v_blocks_cards_grid_items"
          ALTER COLUMN "img_media_type" DROP DEFAULT,
          ALTER COLUMN "img_media_type"
            TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type"
            USING (
              CASE
                WHEN "img_media_type"::text = 'none' THEN 'image'
                ELSE "img_media_type"::text
              END
            )::"public"."enum_home_page_blocks_cards_grid_items_img_media_type",
          ALTER COLUMN "img_media_type" SET DEFAULT 'image';

        DROP TYPE "public"."enum_home_page_blocks_cards_grid_items_img_media_type_old";
      END IF;
    END $$;
  `)
}
