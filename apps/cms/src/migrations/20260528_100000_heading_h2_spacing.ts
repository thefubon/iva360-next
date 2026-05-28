import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Heading H2 block: CMS-controlled top/bottom spacing (desktop, default 24px). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_heading_h2"
      ADD COLUMN IF NOT EXISTS "spacing_top" numeric DEFAULT 24;

    ALTER TABLE "home_page_blocks_heading_h2"
      ADD COLUMN IF NOT EXISTS "spacing_bottom" numeric DEFAULT 24;

    ALTER TABLE "_home_page_v_blocks_heading_h2"
      ADD COLUMN IF NOT EXISTS "spacing_top" numeric DEFAULT 24;

    ALTER TABLE "_home_page_v_blocks_heading_h2"
      ADD COLUMN IF NOT EXISTS "spacing_bottom" numeric DEFAULT 24;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_heading_h2"
      DROP COLUMN IF EXISTS "spacing_top";

    ALTER TABLE "home_page_blocks_heading_h2"
      DROP COLUMN IF EXISTS "spacing_bottom";

    ALTER TABLE "_home_page_v_blocks_heading_h2"
      DROP COLUMN IF EXISTS "spacing_top";

    ALTER TABLE "_home_page_v_blocks_heading_h2"
      DROP COLUMN IF EXISTS "spacing_bottom";
  `)
}
