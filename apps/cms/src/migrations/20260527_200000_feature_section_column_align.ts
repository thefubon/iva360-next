import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Align feature section image columns with Payload schema (imageSection group + pos dbName). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_img_pos"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_pos";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "img_image_id" TO "image_section_image_id";

    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "img_pos" TO "image_section_pos";

    ALTER INDEX IF EXISTS "home_page_blocks_feature_section_img_image_idx"
      RENAME TO "home_page_blocks_feature_section_image_section_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section"
        RENAME CONSTRAINT "home_page_blocks_feature_section_img_image_id_media_id_fk"
        TO "home_page_blocks_feature_section_image_section_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "img_image_id" TO "image_section_image_id";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "img_pos" TO "image_section_pos";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_feature_section_img_image_idx"
      RENAME TO "_home_page_v_blocks_feature_section_image_section_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section"
        RENAME CONSTRAINT "_home_page_v_blocks_feature_section_img_image_id_media_id_fk"
        TO "_home_page_v_blocks_feature_section_image_section_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "image_section_image_id" TO "img_image_id";

    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "image_section_pos" TO "img_pos";

    ALTER INDEX IF EXISTS "home_page_blocks_feature_section_image_section_image_idx"
      RENAME TO "home_page_blocks_feature_section_img_image_idx";

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section"
        RENAME CONSTRAINT "home_page_blocks_feature_section_image_section_image_id_media_id_fk"
        TO "home_page_blocks_feature_section_img_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "image_section_image_id" TO "img_image_id";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "image_section_pos" TO "img_pos";

    ALTER INDEX IF EXISTS "_home_page_v_blocks_feature_section_image_section_image_idx"
      RENAME TO "_home_page_v_blocks_feature_section_img_image_idx";

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section"
        RENAME CONSTRAINT "_home_page_v_blocks_feature_section_image_section_image_id_media_id_fk"
        TO "_home_page_v_blocks_feature_section_img_image_id_media_id_fk";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_pos"
        RENAME TO "enum_home_page_blocks_feature_section_img_pos";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}
