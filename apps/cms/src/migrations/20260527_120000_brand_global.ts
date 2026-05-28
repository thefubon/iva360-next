import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Brand global: icon, background, and color libraries for CMS pickers. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "brand" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "brand_icons" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "image_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "brand_backgrounds" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "color" varchar DEFAULT '#FFFFFF',
      "image_id" integer
    );

    CREATE TABLE IF NOT EXISTS "brand_colors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "value" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "brand_icons"
        ADD CONSTRAINT "brand_icons_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_icons"
        ADD CONSTRAINT "brand_icons_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_backgrounds"
        ADD CONSTRAINT "brand_backgrounds_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_backgrounds"
        ADD CONSTRAINT "brand_backgrounds_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_colors"
        ADD CONSTRAINT "brand_colors_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "brand_icons_order_idx" ON "brand_icons" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "brand_icons_parent_id_idx" ON "brand_icons" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "brand_icons_image_idx" ON "brand_icons" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "brand_backgrounds_order_idx" ON "brand_backgrounds" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "brand_backgrounds_parent_id_idx" ON "brand_backgrounds" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "brand_backgrounds_image_idx" ON "brand_backgrounds" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "brand_colors_order_idx" ON "brand_colors" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "brand_colors_parent_id_idx" ON "brand_colors" USING btree ("_parent_id");

    INSERT INTO "brand" ("updated_at", "created_at")
    SELECT NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "brand");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "brand_colors" CASCADE;
    DROP TABLE IF EXISTS "brand_backgrounds" CASCADE;
    DROP TABLE IF EXISTS "brand_icons" CASCADE;
    DROP TABLE IF EXISTS "brand" CASCADE;
  `)
}
