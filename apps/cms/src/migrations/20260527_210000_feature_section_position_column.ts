import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Rename image position field to `position` (shorter enum/column names for Postgres). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_pos"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "image_section_pos" TO "image_section_position";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "image_section_pos" TO "image_section_position";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      RENAME COLUMN "image_section_position" TO "image_section_pos";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      RENAME COLUMN "image_section_position" TO "image_section_pos";

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_position"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_pos";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}
