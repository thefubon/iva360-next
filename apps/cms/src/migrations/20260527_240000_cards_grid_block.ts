import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Home page: add Cards Grid block (columns setting + array of feature-like cards). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_columns" AS ENUM('2', '3');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_img_pos" AS ENUM('left', 'right');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_blocks_cards_grid_items_btn_variant" AS ENUM('primary', 'secondary', 'outline', 'white', 'green');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "home_page_blocks_cards_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "columns" "enum_home_page_blocks_cards_grid_columns" DEFAULT '2',
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_cards_grid_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "show_beta_badge" boolean DEFAULT false,
      "img_image_id" integer,
      "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'right',
      "img_rounded" boolean DEFAULT false,
      "btn_url" varchar,
      "btn_variant" "enum_home_page_blocks_cards_grid_items_btn_variant" DEFAULT 'primary',
      "btn_new_tab" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "home_page_blocks_cards_grid_items_locales" (
      "title" varchar,
      "description" varchar,
      "btn_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_cards_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "columns" "enum_home_page_blocks_cards_grid_columns" DEFAULT '2',
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_cards_grid_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "show_beta_badge" boolean DEFAULT false,
      "img_image_id" integer,
      "img_pos" "enum_home_page_blocks_cards_grid_items_img_pos" DEFAULT 'right',
      "img_rounded" boolean DEFAULT false,
      "btn_url" varchar,
      "btn_variant" "enum_home_page_blocks_cards_grid_items_btn_variant" DEFAULT 'primary',
      "btn_new_tab" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_locales" (
      "title" varchar,
      "description" varchar,
      "btn_label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid"
        ADD CONSTRAINT "home_page_blocks_cards_grid_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid_items"
        ADD CONSTRAINT "home_page_blocks_cards_grid_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_cards_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid_items"
        ADD CONSTRAINT "home_page_blocks_cards_grid_items_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid_items"
        ADD CONSTRAINT "home_page_blocks_cards_grid_items_img_image_id_media_id_fk"
        FOREIGN KEY ("img_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "home_page_blocks_cards_grid_items_locales"
        ADD CONSTRAINT "home_page_blocks_cards_grid_items_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_cards_grid_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid_items"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_cards_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid_items"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_items_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid_items"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_items_img_image_id_media_id_fk"
        FOREIGN KEY ("img_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_home_page_v_blocks_cards_grid_items_locales"
        ADD CONSTRAINT "_home_page_v_blocks_cards_grid_items_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_cards_grid_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_order_idx"
      ON "home_page_blocks_cards_grid" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_parent_id_idx"
      ON "home_page_blocks_cards_grid" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_path_idx"
      ON "home_page_blocks_cards_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_order_idx"
      ON "home_page_blocks_cards_grid_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_parent_id_idx"
      ON "home_page_blocks_cards_grid_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_icon_idx"
      ON "home_page_blocks_cards_grid_items" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_img_image_idx"
      ON "home_page_blocks_cards_grid_items" USING btree ("img_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "home_page_blocks_cards_grid_items_locales_locale_parent_id_unique"
      ON "home_page_blocks_cards_grid_items_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_order_idx"
      ON "_home_page_v_blocks_cards_grid" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_parent_id_idx"
      ON "_home_page_v_blocks_cards_grid" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_path_idx"
      ON "_home_page_v_blocks_cards_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_order_idx"
      ON "_home_page_v_blocks_cards_grid_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_parent_id_idx"
      ON "_home_page_v_blocks_cards_grid_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_icon_idx"
      ON "_home_page_v_blocks_cards_grid_items" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_img_image_idx"
      ON "_home_page_v_blocks_cards_grid_items" USING btree ("img_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_home_page_v_blocks_cards_grid_items_locales_locale_parent_id_unique"
      ON "_home_page_v_blocks_cards_grid_items_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_home_page_v_blocks_cards_grid_items_locales" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_cards_grid_items" CASCADE;
    DROP TABLE IF EXISTS "_home_page_v_blocks_cards_grid" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_cards_grid_items_locales" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_cards_grid_items" CASCADE;
    DROP TABLE IF EXISTS "home_page_blocks_cards_grid" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_btn_variant";
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_items_img_pos";
    DROP TYPE IF EXISTS "public"."enum_home_page_blocks_cards_grid_columns";
  `)
}
