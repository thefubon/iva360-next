import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Home page: add Feature Section block (title, description, image, icon, button, image position). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_feature_section_image_position" AS ENUM('left', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_feature_section_button_section_variant" AS ENUM('primary', 'outline', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "home_page_blocks_feature_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "image_id" integer,
      "image_position" "enum_home_page_blocks_feature_section_image_position" DEFAULT 'right',
      "button_section_url" varchar,
      "button_section_variant" "enum_home_page_blocks_feature_section_button_section_variant" DEFAULT 'primary',
      "button_section_open_in_new_tab" boolean DEFAULT false,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_feature_section_locales" (
      "title" varchar,
      "description" varchar,
      "button_section_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_feature_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "icon_id" integer,
      "image_id" integer,
      "image_position" "enum_home_page_blocks_feature_section_image_position" DEFAULT 'right',
      "button_section_url" varchar,
      "button_section_variant" "enum_home_page_blocks_feature_section_button_section_variant" DEFAULT 'primary',
      "button_section_open_in_new_tab" boolean DEFAULT false,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_feature_section_locales" (
      "title" varchar,
      "description" varchar,
      "button_section_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section"
        ADD CONSTRAINT "home_page_blocks_feature_section_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section"
        ADD CONSTRAINT "home_page_blocks_feature_section_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section"
        ADD CONSTRAINT "home_page_blocks_feature_section_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_feature_section_locales"
        ADD CONSTRAINT "home_page_blocks_feature_section_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_feature_section"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section"
        ADD CONSTRAINT "_home_page_v_blocks_feature_section_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section"
        ADD CONSTRAINT "_home_page_v_blocks_feature_section_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section"
        ADD CONSTRAINT "_home_page_v_blocks_feature_section_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_feature_section_locales"
        ADD CONSTRAINT "_home_page_v_blocks_feature_section_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_feature_section"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_feature_section_order_idx"
      ON "home_page_blocks_feature_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_feature_section_parent_id_idx"
      ON "home_page_blocks_feature_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_feature_section_path_idx"
      ON "home_page_blocks_feature_section" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_feature_section_icon_idx"
      ON "home_page_blocks_feature_section" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_feature_section_image_idx"
      ON "home_page_blocks_feature_section" USING btree ("image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_feature_section_locales_locale_parent_id_unique"
      ON "home_page_blocks_feature_section_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_order_idx"
      ON "_home_page_v_blocks_feature_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_parent_id_idx"
      ON "_home_page_v_blocks_feature_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_path_idx"
      ON "_home_page_v_blocks_feature_section" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_icon_idx"
      ON "_home_page_v_blocks_feature_section" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_image_idx"
      ON "_home_page_v_blocks_feature_section" USING btree ("image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_feature_section_locales_locale_parent_id_unique"
      ON "_home_page_v_blocks_feature_section_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_home_page_v_blocks_feature_section_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_feature_section" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_feature_section_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_feature_section" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_feature_section_button_section_variant";
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_feature_section_image_position";
  `)
}
