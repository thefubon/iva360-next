import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Moves topbar global array data onto the header global and renames DB tables
 * to match Payload's `header` + `phones` / `rightLinks` field paths.
 *
 * Idempotent: safe when dev mode already pushed part of the schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "header" ("updated_at", "created_at")
    SELECT NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "header");

    DO $$
    BEGIN
      IF to_regclass('public.topbar_phones') IS NOT NULL
         AND to_regclass('public.header_phones') IS NULL THEN
        UPDATE "topbar_phones"
        SET "_parent_id" = (SELECT "id" FROM "header" ORDER BY "id" LIMIT 1)
        WHERE EXISTS (SELECT 1 FROM "topbar");

        ALTER TABLE "topbar_phones" DROP CONSTRAINT IF EXISTS "topbar_phones_parent_id_fk";

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_topbar_phones_icon_type')
           AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_header_phones_icon_type') THEN
          ALTER TYPE "public"."enum_topbar_phones_icon_type" RENAME TO "enum_header_phones_icon_type";
        END IF;

        ALTER TABLE "topbar_phones" RENAME TO "header_phones";
        ALTER INDEX IF EXISTS "topbar_phones_order_idx" RENAME TO "header_phones_order_idx";
        ALTER INDEX IF EXISTS "topbar_phones_parent_id_idx" RENAME TO "header_phones_parent_id_idx";
        ALTER INDEX IF EXISTS "topbar_phones_custom_icon_idx" RENAME TO "header_phones_custom_icon_idx";

        IF to_regclass('public.topbar_phones_locales') IS NOT NULL THEN
          ALTER TABLE "topbar_phones_locales" RENAME TO "header_phones_locales";
          ALTER INDEX IF EXISTS "topbar_phones_locales_locale_parent_id_unique"
            RENAME TO "header_phones_locales_locale_parent_id_unique";
        END IF;

        ALTER TABLE "header_phones"
          ADD CONSTRAINT "header_phones_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      IF to_regclass('public.topbar_right_links') IS NOT NULL
         AND to_regclass('public.header_right_links') IS NULL THEN
        UPDATE "topbar_right_links"
        SET "_parent_id" = (SELECT "id" FROM "header" ORDER BY "id" LIMIT 1)
        WHERE EXISTS (SELECT 1 FROM "topbar");

        ALTER TABLE "topbar_right_links" DROP CONSTRAINT IF EXISTS "topbar_right_links_parent_id_fk";

        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_topbar_right_links_icon_type')
           AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_header_right_links_icon_type') THEN
          ALTER TYPE "public"."enum_topbar_right_links_icon_type" RENAME TO "enum_header_right_links_icon_type";
        END IF;

        ALTER TABLE "topbar_right_links" RENAME TO "header_right_links";
        ALTER INDEX IF EXISTS "topbar_right_links_order_idx" RENAME TO "header_right_links_order_idx";
        ALTER INDEX IF EXISTS "topbar_right_links_parent_id_idx" RENAME TO "header_right_links_parent_id_idx";
        ALTER INDEX IF EXISTS "topbar_right_links_custom_icon_idx" RENAME TO "header_right_links_custom_icon_idx";

        IF to_regclass('public.topbar_right_links_locales') IS NOT NULL THEN
          ALTER TABLE "topbar_right_links_locales" RENAME TO "header_right_links_locales";
          ALTER INDEX IF EXISTS "topbar_right_links_locales_locale_parent_id_unique"
            RENAME TO "header_right_links_locales_locale_parent_id_unique";
        END IF;

        ALTER TABLE "header_right_links"
          ADD CONSTRAINT "header_right_links_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DROP TABLE IF EXISTS "topbar" CASCADE;

    DELETE FROM "search" WHERE "global_slug" = 'topbar';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "topbar" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    INSERT INTO "topbar" ("updated_at", "created_at")
    SELECT NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "topbar");

    ALTER TABLE "header_phones" DROP CONSTRAINT IF EXISTS "header_phones_parent_id_fk";
    ALTER TABLE "header_right_links" DROP CONSTRAINT IF EXISTS "header_right_links_parent_id_fk";

    ALTER TYPE "public"."enum_header_phones_icon_type" RENAME TO "enum_topbar_phones_icon_type";
    ALTER TYPE "public"."enum_header_right_links_icon_type" RENAME TO "enum_topbar_right_links_icon_type";

    ALTER TABLE "header_phones" RENAME TO "topbar_phones";
    ALTER TABLE "header_phones_locales" RENAME TO "topbar_phones_locales";
    ALTER TABLE "header_right_links" RENAME TO "topbar_right_links";
    ALTER TABLE "header_right_links_locales" RENAME TO "topbar_right_links_locales";

    ALTER INDEX IF EXISTS "header_phones_order_idx" RENAME TO "topbar_phones_order_idx";
    ALTER INDEX IF EXISTS "header_phones_parent_id_idx" RENAME TO "topbar_phones_parent_id_idx";
    ALTER INDEX IF EXISTS "header_phones_custom_icon_idx" RENAME TO "topbar_phones_custom_icon_idx";
    ALTER INDEX IF EXISTS "header_phones_locales_locale_parent_id_unique"
      RENAME TO "topbar_phones_locales_locale_parent_id_unique";

    ALTER INDEX IF EXISTS "header_right_links_order_idx" RENAME TO "topbar_right_links_order_idx";
    ALTER INDEX IF EXISTS "header_right_links_parent_id_idx" RENAME TO "topbar_right_links_parent_id_idx";
    ALTER INDEX IF EXISTS "header_right_links_custom_icon_idx" RENAME TO "topbar_right_links_custom_icon_idx";
    ALTER INDEX IF EXISTS "header_right_links_locales_locale_parent_id_unique"
      RENAME TO "topbar_right_links_locales_locale_parent_id_unique";

    UPDATE "topbar_phones"
    SET "_parent_id" = (SELECT "id" FROM "topbar" ORDER BY "id" LIMIT 1);

    UPDATE "topbar_right_links"
    SET "_parent_id" = (SELECT "id" FROM "topbar" ORDER BY "id" LIMIT 1);

    ALTER TABLE "topbar_phones"
      ADD CONSTRAINT "topbar_phones_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;

    ALTER TABLE "topbar_right_links"
      ADD CONSTRAINT "topbar_right_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)
}
