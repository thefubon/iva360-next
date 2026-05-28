import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Cards Grid: add 1-column option to desktop columns selector. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_cards_grid_columns" ADD VALUE IF NOT EXISTS '1';
    EXCEPTION WHEN undefined_object THEN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_columns" AS ENUM('1', '2', '3', '4');
    END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Postgres does not support removing enum values safely.
}
