import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Hero block: replace description section with subscriptions badges array. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      DROP COLUMN IF EXISTS "description_section_description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      DROP COLUMN IF EXISTS "description_section_description";

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "image_id" integer,
      "background_color" varchar DEFAULT '#FFFFFF',
      "text_color" varchar DEFAULT '#000000',
      "open_in_new_tab" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "image_id" integer,
      "background_color" varchar DEFAULT '#FFFFFF',
      "text_color" varchar DEFAULT '#000000',
      "open_in_new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_subscriptions_section_badges"
        ADD CONSTRAINT "home_page_blocks_hero_subscriptions_section_badges_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_subscriptions_section_badges"
        ADD CONSTRAINT "home_page_blocks_hero_subscriptions_section_badges_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_hero_subscriptions_section_badges_locales"
        ADD CONSTRAINT "home_page_blocks_hero_subscriptions_section_badges_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero_subscriptions_section_badges"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_subscriptions_section_badges"
        ADD CONSTRAINT "_home_page_v_blocks_hero_subscriptions_section_badges_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_subscriptions_section_badges"
        ADD CONSTRAINT "_home_page_v_blocks_hero_subscriptions_section_badges_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_hero_subscriptions_section_badges_locales"
        ADD CONSTRAINT "_home_page_v_blocks_hero_subscriptions_section_badges_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero_subscriptions_section_badges"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges_order_idx"
      ON "home_page_blocks_hero_subscriptions_section_badges" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges_parent_id_idx"
      ON "home_page_blocks_hero_subscriptions_section_badges" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges_image_idx"
      ON "home_page_blocks_hero_subscriptions_section_badges" USING btree ("image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_hero_subscriptions_section_badges_locales_locale_parent_id_unique"
      ON "home_page_blocks_hero_subscriptions_section_badges_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_order_idx"
      ON "_home_page_v_blocks_hero_subscriptions_section_badges" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_parent_id_idx"
      ON "_home_page_v_blocks_hero_subscriptions_section_badges" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_image_idx"
      ON "_home_page_v_blocks_hero_subscriptions_section_badges" USING btree ("image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_locales_locale_parent_id_unique"
      ON "_home_page_v_blocks_hero_subscriptions_section_badges_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_hero_subscriptions_section_badges" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_hero_subscriptions_section_badges_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_hero_subscriptions_section_badges" CASCADE;

    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_section_description" varchar;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_section_description" varchar;
  `)
}
