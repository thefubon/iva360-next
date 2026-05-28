import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "global_slug" varchar;
   ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "global_field_key" varchar;
   CREATE INDEX IF NOT EXISTS "search_global_slug_idx" ON "search" USING btree ("global_slug");
   CREATE INDEX IF NOT EXISTS "search_global_field_key_idx" ON "search" USING btree ("global_field_key");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "search_global_field_key_idx";
   DROP INDEX IF EXISTS "search_global_slug_idx";
   ALTER TABLE "search" DROP COLUMN IF EXISTS "global_field_key";
   ALTER TABLE "search" DROP COLUMN IF EXISTS "global_slug";`)
}
