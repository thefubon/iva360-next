import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block description: Lexical richText (jsonb) → plain varchar.
 * Recursively extracts text nodes; non-breaking spaces in text are preserved.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION "extract_lexical_plaintext"(doc jsonb) RETURNS text
    LANGUAGE plpgsql IMMUTABLE AS $$
    DECLARE
      result text := '';
      child jsonb;
      node_type text;
    BEGIN
      IF doc IS NULL THEN
        RETURN NULL;
      END IF;

      node_type := doc->>'type';

      IF node_type = 'text' AND doc ? 'text' THEN
        RETURN doc->>'text';
      END IF;

      IF doc ? 'children' AND jsonb_typeof(doc->'children') = 'array' THEN
        FOR child IN SELECT value FROM jsonb_array_elements(doc->'children') AS t(value)
        LOOP
          IF (child->>'type') = 'paragraph' AND result <> '' THEN
            result := result || E'\n';
          END IF;
          result := result || COALESCE("extract_lexical_plaintext"(child), '');
        END LOOP;
      END IF;

      RETURN result;
    END;
    $$;

    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_plain" varchar;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_plain" varchar;

    UPDATE "home_page_blocks_hero_locales"
    SET "description_plain" = NULLIF(
      btrim("extract_lexical_plaintext"("description"->'root')),
      ''
    )
    WHERE "description" IS NOT NULL
      AND jsonb_typeof("description"::jsonb) = 'object';

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "description_plain" = NULLIF(
      btrim("extract_lexical_plaintext"("description"->'root')),
      ''
    )
    WHERE "description" IS NOT NULL
      AND jsonb_typeof("description"::jsonb) = 'object';

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "description";

    ALTER TABLE "home_page_blocks_hero_locales"
      RENAME COLUMN "description_plain" TO "description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      RENAME COLUMN "description_plain" TO "description";

    DROP FUNCTION IF EXISTS "extract_lexical_plaintext"(jsonb);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_rich" jsonb;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_rich" jsonb;

    UPDATE "home_page_blocks_hero_locales"
    SET "description_rich" = jsonb_build_object(
      'root', jsonb_build_object(
        'type', 'root',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'children', jsonb_build_array(
              jsonb_build_object(
                'type', 'text',
                'text', "description",
                'format', 0,
                'mode', 'normal',
                'style', '',
                'detail', 0,
                'version', 1
              )
            ),
            'direction', null,
            'format', '',
            'indent', 0,
            'textFormat', 0,
            'textStyle', '',
            'version', 1
          )
        ),
        'direction', null,
        'format', '',
        'indent', 0,
        'version', 1
      )
    )
    WHERE "description" IS NOT NULL AND btrim("description") <> '';

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "description_rich" = jsonb_build_object(
      'root', jsonb_build_object(
        'type', 'root',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'children', jsonb_build_array(
              jsonb_build_object(
                'type', 'text',
                'text', "description",
                'format', 0,
                'mode', 'normal',
                'style', '',
                'detail', 0,
                'version', 1
              )
            ),
            'direction', null,
            'format', '',
            'indent', 0,
            'textFormat', 0,
            'textStyle', '',
            'version', 1
          )
        ),
        'direction', null,
        'format', '',
        'indent', 0,
        'version', 1
      )
    )
    WHERE "description" IS NOT NULL AND btrim("description") <> '';

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "description";

    ALTER TABLE "home_page_blocks_hero_locales"
      RENAME COLUMN "description_rich" TO "description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      RENAME COLUMN "description_rich" TO "description";`)
}
