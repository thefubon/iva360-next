import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Add secondary and green values to Hero / Feature Section button variant enums. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_hero_buttons_section_buttons_variant"
        ADD VALUE IF NOT EXISTS 'secondary';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_hero_buttons_section_buttons_variant"
        ADD VALUE IF NOT EXISTS 'green';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum__home_page_v_blocks_hero_buttons_section_buttons_variant"
        ADD VALUE IF NOT EXISTS 'secondary';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum__home_page_v_blocks_hero_buttons_section_buttons_variant"
        ADD VALUE IF NOT EXISTS 'green';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_button_section_variant"
        ADD VALUE IF NOT EXISTS 'secondary';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_button_section_variant"
        ADD VALUE IF NOT EXISTS 'green';
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Postgres does not support removing enum values safely.
}
