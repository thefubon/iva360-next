import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Brand global: logos library tab. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "brand_logos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "image_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "brand_logos"
        ADD CONSTRAINT "brand_logos_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_logos"
        ADD CONSTRAINT "brand_logos_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "brand_logos_order_idx" ON "brand_logos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "brand_logos_parent_id_idx" ON "brand_logos" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "brand_logos_image_idx" ON "brand_logos" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "brand_logos" CASCADE;
  `)
}
