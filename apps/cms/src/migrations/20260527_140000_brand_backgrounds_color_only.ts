import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Brand backgrounds: color only, no optional image upload. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "brand_backgrounds" DROP COLUMN IF EXISTS "image_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "brand_backgrounds" ADD COLUMN IF NOT EXISTS "image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "brand_backgrounds"
        ADD CONSTRAINT "brand_backgrounds_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "brand_backgrounds_image_idx" ON "brand_backgrounds" USING btree ("image_id");
  `)
}
