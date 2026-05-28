import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Removes legacy media rows from the plugin-search index (media is no longer synced). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "search"
   WHERE "id" IN (
     SELECT "parent_id" FROM "search_rels" WHERE "media_id" IS NOT NULL
   );`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Media search rows are not restored; re-sync would require re-adding media to searchPlugin collections.
}
