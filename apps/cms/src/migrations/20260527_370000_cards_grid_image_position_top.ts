import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: add top value to img.position enum. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_items_img_position"
        ADD VALUE IF NOT EXISTS 'top';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Postgres does not support removing enum values safely.
}
