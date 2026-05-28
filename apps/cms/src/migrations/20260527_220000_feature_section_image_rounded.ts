import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Feature Section: optional image rounding toggle in imageSection group. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      ADD COLUMN IF NOT EXISTS "image_section_rounded_image" boolean DEFAULT false;

    ALTER TABLE "_home_page_v_blocks_feature_section"
      ADD COLUMN IF NOT EXISTS "image_section_rounded_image" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      DROP COLUMN IF EXISTS "image_section_rounded_image";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      DROP COLUMN IF EXISTS "image_section_rounded_image";
  `)
}
