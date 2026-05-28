import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Rename hero button variant enums after buttonsSection group nesting. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_hero_buttons_variant"
        RENAME TO "enum_home_page_blocks_hero_buttons_section_buttons_variant";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum__home_page_v_blocks_hero_buttons_variant"
        RENAME TO "enum__home_page_v_blocks_hero_buttons_section_buttons_variant";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_hero_buttons_section_buttons_variant"
        RENAME TO "enum_home_page_blocks_hero_buttons_variant";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum__home_page_v_blocks_hero_buttons_section_buttons_variant"
        RENAME TO "enum__home_page_v_blocks_hero_buttons_variant";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}
