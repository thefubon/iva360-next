import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block description: plain varchar or Lexical jsonb → TipTap HTML (varchar).
 * Preserves bold from Lexical and non-breaking spaces from plain text.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION "lexical_node_to_tiptap_html"(node jsonb) RETURNS text
    LANGUAGE plpgsql IMMUTABLE AS $$
    DECLARE
      node_type text;
      result text := '';
      child jsonb;
      text_content text;
      format_val int;
    BEGIN
      IF node IS NULL THEN
        RETURN NULL;
      END IF;

      node_type := node->>'type';

      IF node_type = 'text' AND node ? 'text' THEN
        text_content := node->>'text';
        text_content := replace(text_content, '&', '&amp;');
        text_content := replace(text_content, '<', '&lt;');
        text_content := replace(text_content, '>', '&gt;');
        format_val := COALESCE((node->>'format')::int, 0);

        IF (format_val & 1) = 1 THEN
          RETURN '<strong>' || text_content || '</strong>';
        END IF;

        RETURN text_content;
      END IF;

      IF node_type = 'paragraph' THEN
        result := '';
        FOR child IN SELECT value FROM jsonb_array_elements(COALESCE(node->'children', '[]'::jsonb)) AS t(value)
        LOOP
          result := result || COALESCE("lexical_node_to_tiptap_html"(child), '');
        END LOOP;
        RETURN '<p>' || result || '</p>';
      END IF;

      IF node ? 'children' AND jsonb_typeof(node->'children') = 'array' THEN
        FOR child IN SELECT value FROM jsonb_array_elements(node->'children') AS t(value)
        LOOP
          result := result || COALESCE("lexical_node_to_tiptap_html"(child), '');
        END LOOP;
      END IF;

      RETURN result;
    END;
    $$;

    CREATE OR REPLACE FUNCTION "lexical_to_tiptap_html"(doc jsonb) RETURNS text
    LANGUAGE plpgsql IMMUTABLE AS $$
    BEGIN
      IF doc IS NULL OR NOT (doc ? 'root') THEN
        RETURN NULL;
      END IF;

      RETURN NULLIF(btrim("lexical_node_to_tiptap_html"(doc->'root')), '');
    END;
    $$;

    CREATE OR REPLACE FUNCTION "plain_text_to_tiptap_html"(input text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE AS $$
    DECLARE
      result text;
    BEGIN
      IF input IS NULL OR btrim(input) = '' THEN
        RETURN NULL;
      END IF;

      IF input ~ '^\s*<' THEN
        RETURN input;
      END IF;

      result := input;
      result := replace(result, '&nbsp;', E'\x01NBSP\x01');
      result := replace(result, '&#160;', E'\x01NBSP\x01');
      result := replace(result, '&', '&amp;');
      result := replace(result, '<', '&lt;');
      result := replace(result, '>', '&gt;');
      result := replace(result, E'\x01NBSP\x01', '&nbsp;');

      RETURN '<p>' || result || '</p>';
    END;
    $$;

    DO $$
    DECLARE
      col_type text;
    BEGIN
      SELECT data_type INTO col_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'home_page_blocks_hero_locales'
        AND column_name = 'description';

      IF col_type = 'jsonb' THEN
        EXECUTE $sql$
          ALTER TABLE "home_page_blocks_hero_locales"
            ADD COLUMN IF NOT EXISTS "description_html" varchar;

          ALTER TABLE "_home_page_v_blocks_hero_locales"
            ADD COLUMN IF NOT EXISTS "description_html" varchar;

          UPDATE "home_page_blocks_hero_locales"
          SET "description_html" = "lexical_to_tiptap_html"("description"::jsonb)
          WHERE "description" IS NOT NULL;

          UPDATE "_home_page_v_blocks_hero_locales"
          SET "description_html" = "lexical_to_tiptap_html"("description"::jsonb)
          WHERE "description" IS NOT NULL;

          ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "description";
          ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "description";

          ALTER TABLE "home_page_blocks_hero_locales"
            RENAME COLUMN "description_html" TO "description";

          ALTER TABLE "_home_page_v_blocks_hero_locales"
            RENAME COLUMN "description_html" TO "description";
        $sql$;
      ELSE
        EXECUTE $sql$
          UPDATE "home_page_blocks_hero_locales"
          SET "description" = "plain_text_to_tiptap_html"("description")
          WHERE "description" IS NOT NULL
            AND btrim("description") <> ''
            AND "description" !~ '^\s*<';

          UPDATE "_home_page_v_blocks_hero_locales"
          SET "description" = "plain_text_to_tiptap_html"("description")
          WHERE "description" IS NOT NULL
            AND btrim("description") <> ''
            AND "description" !~ '^\s*<';
        $sql$;
      END IF;
    END $$;

    DROP FUNCTION IF EXISTS "plain_text_to_tiptap_html"(text);
    DROP FUNCTION IF EXISTS "lexical_to_tiptap_html"(jsonb);
    DROP FUNCTION IF EXISTS "lexical_node_to_tiptap_html"(jsonb);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION "tiptap_html_to_plain_text"(input text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE AS $$
    DECLARE
      result text;
    BEGIN
      IF input IS NULL OR btrim(input) = '' THEN
        RETURN NULL;
      END IF;

      result := regexp_replace(input, '<br\s*/?>', E'\n', 'gi');
      result := regexp_replace(result, '</p>', E'\n', 'gi');
      result := regexp_replace(result, '<[^>]+>', '', 'g');
      result := replace(result, '&nbsp;', chr(160));
      result := replace(result, '&amp;', '&');
      result := replace(result, '&lt;', '<');
      result := replace(result, '&gt;', '>');
      result := btrim(result);

      RETURN NULLIF(result, '');
    END;
    $$;

    UPDATE "home_page_blocks_hero_locales"
    SET "description" = "tiptap_html_to_plain_text"("description")
    WHERE "description" IS NOT NULL;

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "description" = "tiptap_html_to_plain_text"("description")
    WHERE "description" IS NOT NULL;

    DROP FUNCTION IF EXISTS "tiptap_html_to_plain_text"(text);`)
}
