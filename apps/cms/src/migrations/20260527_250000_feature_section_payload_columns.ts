import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align feature section columns with Payload Drizzle naming:
 * imageSection.image + position → image_section_image_position.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_feature_section'
          AND column_name = 'image_section_pos'
      ) THEN
        ALTER TABLE "home_page_blocks_feature_section"
          RENAME COLUMN "image_section_pos" TO "image_section_image_position";
      ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_feature_section'
          AND column_name = 'image_section_position'
      ) THEN
        ALTER TABLE "home_page_blocks_feature_section"
          RENAME COLUMN "image_section_position" TO "image_section_image_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_feature_section'
          AND column_name = 'image_section_pos'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_feature_section"
          RENAME COLUMN "image_section_pos" TO "image_section_image_position";
      ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_feature_section'
          AND column_name = 'image_section_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_feature_section"
          RENAME COLUMN "image_section_position" TO "image_section_image_position";
      END IF;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_pos"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_image_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_position"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_image_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_home_page_blocks_feature_section_image_section_image_position"
        RENAME TO "enum_home_page_blocks_feature_section_image_section_position";
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'home_page_blocks_feature_section'
          AND column_name = 'image_section_image_position'
      ) THEN
        ALTER TABLE "home_page_blocks_feature_section"
          RENAME COLUMN "image_section_image_position" TO "image_section_position";
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = '_home_page_v_blocks_feature_section'
          AND column_name = 'image_section_image_position'
      ) THEN
        ALTER TABLE "_home_page_v_blocks_feature_section"
          RENAME COLUMN "image_section_image_position" TO "image_section_position";
      END IF;
    END $$;
  `)
}
