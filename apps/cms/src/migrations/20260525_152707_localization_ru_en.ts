import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
      CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      CREATE TYPE "public"."enum_topbar_phones_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      CREATE TYPE "public"."enum_topbar_right_links_icon_type" AS ENUM('hugeicons', 'custom', 'none');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('vk', 'telegram', 'youtube', 'other');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "topbar_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"icon_type" "enum_topbar_phones_icon_type" DEFAULT 'hugeicons',
  	"hugeicons_name" varchar DEFAULT 'CallIcon',
  	"custom_icon_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "topbar_phones_locales" (
  	"number" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "topbar_right_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"icon_type" "enum_topbar_right_links_icon_type" DEFAULT 'hugeicons',
  	"hugeicons_name" varchar DEFAULT 'CallIcon',
  	"custom_icon_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "topbar_right_links_locales" (
  	"number" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "topbar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header_navigation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_locales" (
  	"site_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_locales" (
  	"copyright" varchar,
  	"contact_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DO $$ BEGIN
      ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_phones" ADD CONSTRAINT "topbar_phones_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_phones" ADD CONSTRAINT "topbar_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_phones_locales" ADD CONSTRAINT "topbar_phones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar_phones"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_right_links" ADD CONSTRAINT "topbar_right_links_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_right_links" ADD CONSTRAINT "topbar_right_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "topbar_right_links_locales" ADD CONSTRAINT "topbar_right_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar_right_links"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "header_navigation" ADD CONSTRAINT "header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "header_navigation_locales" ADD CONSTRAINT "header_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "footer_links_locales" ADD CONSTRAINT "footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  DO $$ BEGIN
      ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "topbar_phones_order_idx" ON "topbar_phones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "topbar_phones_parent_id_idx" ON "topbar_phones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "topbar_phones_custom_icon_idx" ON "topbar_phones" USING btree ("custom_icon_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "topbar_phones_locales_locale_parent_id_unique" ON "topbar_phones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "topbar_right_links_order_idx" ON "topbar_right_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "topbar_right_links_parent_id_idx" ON "topbar_right_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "topbar_right_links_custom_icon_idx" ON "topbar_right_links" USING btree ("custom_icon_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "topbar_right_links_locales_locale_parent_id_unique" ON "topbar_right_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "header_navigation_order_idx" ON "header_navigation" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_navigation_parent_id_idx" ON "header_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "header_navigation_locales_locale_parent_id_unique" ON "header_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_links_order_idx" ON "footer_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_links_parent_id_idx" ON "footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_links_locales_locale_parent_id_unique" ON "footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "topbar_phones" CASCADE;
  DROP TABLE "topbar_phones_locales" CASCADE;
  DROP TABLE "topbar_right_links" CASCADE;
  DROP TABLE "topbar_right_links_locales" CASCADE;
  DROP TABLE "topbar" CASCADE;
  DROP TABLE "header_navigation" CASCADE;
  DROP TABLE "header_navigation_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TABLE "footer_links_locales" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_topbar_phones_icon_type";
  DROP TYPE "public"."enum_topbar_right_links_icon_type";
  DROP TYPE "public"."enum_footer_social_links_platform";`)
}
