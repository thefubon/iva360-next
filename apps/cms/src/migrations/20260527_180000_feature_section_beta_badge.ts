import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Feature Section block: optional Beta badge toggle on title. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      ADD COLUMN IF NOT EXISTS "show_beta_badge" boolean DEFAULT false;

    ALTER TABLE "_home_page_v_blocks_feature_section"
      ADD COLUMN IF NOT EXISTS "show_beta_badge" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_feature_section"
      DROP COLUMN IF EXISTS "show_beta_badge";

    ALTER TABLE "_home_page_v_blocks_feature_section"
      DROP COLUMN IF EXISTS "show_beta_badge";
  `)
}
