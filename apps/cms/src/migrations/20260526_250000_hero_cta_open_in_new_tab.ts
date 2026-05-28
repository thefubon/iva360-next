import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block: optional openInNewTab checkbox on CTA button.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero"
      ADD COLUMN IF NOT EXISTS "cta_open_in_new_tab" boolean DEFAULT false;

    ALTER TABLE "_home_page_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "cta_open_in_new_tab" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero"
      DROP COLUMN IF EXISTS "cta_open_in_new_tab";

    ALTER TABLE "_home_page_v_blocks_hero"
      DROP COLUMN IF EXISTS "cta_open_in_new_tab";
  `)
}
