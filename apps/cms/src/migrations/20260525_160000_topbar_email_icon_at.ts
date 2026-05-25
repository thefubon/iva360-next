import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Replace legacy mail/phone icons on mailto links with AtIcon from the allowlist. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "topbar_phones"
    SET "hugeicons_name" = 'AtIcon'
    WHERE "url" ILIKE 'mailto:%'
      AND "hugeicons_name" <> 'AtIcon';

    UPDATE "topbar_right_links"
    SET "hugeicons_name" = 'AtIcon'
    WHERE "url" ILIKE 'mailto:%'
      AND "hugeicons_name" <> 'AtIcon';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "topbar_phones"
    SET "hugeicons_name" = 'Mail01Icon'
    WHERE "url" ILIKE 'mailto:%'
      AND "hugeicons_name" = 'AtIcon';

    UPDATE "topbar_right_links"
    SET "hugeicons_name" = 'Mail01Icon'
    WHERE "url" ILIKE 'mailto:%'
      AND "hugeicons_name" = 'AtIcon';
  `)
}
