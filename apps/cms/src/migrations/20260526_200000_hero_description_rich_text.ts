import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hero block description: varchar → Lexical richText (jsonb).
 * Converts existing plain text to minimal Lexical JSON.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_plain" varchar;

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      ADD COLUMN IF NOT EXISTS "description_plain" varchar;

    UPDATE "home_page_blocks_hero_locales"
    SET "description_plain" = "description"#>>'{root,children,0,children,0,text}'
    WHERE "description" IS NOT NULL;

    UPDATE "_home_page_v_blocks_hero_locales"
    SET "description_plain" = "description"#>>'{root,children,0,children,0,text}'
    WHERE "description" IS NOT NULL;

    ALTER TABLE "home_page_blocks_hero_locales" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "_home_page_v_blocks_hero_locales" DROP COLUMN IF EXISTS "description";

    ALTER TABLE "home_page_blocks_hero_locales"
      RENAME COLUMN "description_plain" TO "description";

    ALTER TABLE "_home_page_v_blocks_hero_locales"
      RENAME COLUMN "description_plain" TO "description";`)
}
