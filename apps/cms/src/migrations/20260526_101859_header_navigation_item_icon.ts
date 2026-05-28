import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navigation" ADD COLUMN IF NOT EXISTS "icon_id" integer;
  ALTER TABLE "header_navigation" ADD COLUMN IF NOT EXISTS "mobile_menu_only" boolean DEFAULT false;

  DO $$ BEGIN
    ALTER TABLE "header_navigation"
      ADD CONSTRAINT "header_navigation_icon_id_media_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  CREATE INDEX IF NOT EXISTS "header_navigation_icon_idx" ON "header_navigation" USING btree ("icon_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navigation" DROP CONSTRAINT IF EXISTS "header_navigation_icon_id_media_id_fk";

  DROP INDEX IF EXISTS "header_navigation_icon_idx";
  ALTER TABLE "header_navigation" DROP COLUMN IF EXISTS "icon_id";
  ALTER TABLE "header_navigation" DROP COLUMN IF EXISTS "mobile_menu_only";`)
}
