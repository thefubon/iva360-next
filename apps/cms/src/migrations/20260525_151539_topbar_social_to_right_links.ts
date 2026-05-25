import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "topbar_social_links" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_topbar_social_links_platform";

    DO $$ BEGIN
      CREATE TYPE "public"."enum_topbar_right_links_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "topbar_right_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar NOT NULL,
      "url" varchar,
      "open_in_new_tab" boolean DEFAULT false,
      "icon_type" "enum_topbar_right_links_icon_type" DEFAULT 'hugeicons',
      "hugeicons_name" varchar DEFAULT 'CallIcon',
      "custom_icon_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "topbar_right_links"
        ADD CONSTRAINT "topbar_right_links_custom_icon_id_media_id_fk"
        FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "topbar_right_links"
        ADD CONSTRAINT "topbar_right_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "topbar_right_links_order_idx" ON "topbar_right_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "topbar_right_links_parent_id_idx" ON "topbar_right_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "topbar_right_links_custom_icon_idx" ON "topbar_right_links" USING btree ("custom_icon_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "topbar_right_links" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_topbar_right_links_icon_type";

    DO $$ BEGIN
      CREATE TYPE "public"."enum_topbar_social_links_platform" AS ENUM('vk', 'telegram', 'youtube', 'other');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "topbar_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" "enum_topbar_social_links_platform" NOT NULL,
      "url" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "topbar_social_links"
        ADD CONSTRAINT "topbar_social_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "topbar_social_links_order_idx" ON "topbar_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "topbar_social_links_parent_id_idx" ON "topbar_social_links" USING btree ("_parent_id");
  `)
}
