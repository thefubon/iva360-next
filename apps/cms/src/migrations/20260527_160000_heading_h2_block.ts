import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Home page: add Heading H2 block (36px). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_blocks_heading_h2" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_heading_h2_locales" (
      "text" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_heading_h2" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_heading_h2_locales" (
      "text" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_heading_h2"
        ADD CONSTRAINT "home_page_blocks_heading_h2_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_heading_h2_locales"
        ADD CONSTRAINT "home_page_blocks_heading_h2_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_heading_h2"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_heading_h2"
        ADD CONSTRAINT "_home_page_v_blocks_heading_h2_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_heading_h2_locales"
        ADD CONSTRAINT "_home_page_v_blocks_heading_h2_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_heading_h2"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_heading_h2_order_idx"
      ON "home_page_blocks_heading_h2" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_heading_h2_parent_id_idx"
      ON "home_page_blocks_heading_h2" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_heading_h2_path_idx"
      ON "home_page_blocks_heading_h2" USING btree ("_path");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_heading_h2_locales_locale_parent_id_unique"
      ON "home_page_blocks_heading_h2_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_heading_h2_order_idx"
      ON "_home_page_v_blocks_heading_h2" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_heading_h2_parent_id_idx"
      ON "_home_page_v_blocks_heading_h2" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_heading_h2_path_idx"
      ON "_home_page_v_blocks_heading_h2" USING btree ("_path");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_heading_h2_locales_locale_parent_id_unique"
      ON "_home_page_v_blocks_heading_h2_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_home_page_v_blocks_heading_h2_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_heading_h2" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_heading_h2_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_heading_h2" CASCADE;
  `)
}
