/**
 * Curated allowlist of Hugeicons names available in CMS (topbar links) and web topbar.
 *
 * Add icons here only when needed — do not regenerate the full 5000+ icon catalog.
 *
 * To add a new icon:
 * 1. Confirm the export name exists in `@hugeicons/core-free-icons`.
 * 2. Append the name to `HUGEICONS_ALLOWLIST` below.
 * 3. Add a static import + map entry in:
 *    - `apps/web/src/widgets/topbar/lib/get-hugeicon.ts`
 *    - `apps/cms/src/lib/hugeicons-registry.ts`
 */

/** Icons used in topbar CMS content (phones + right links). */
export const HUGEICONS_ALLOWLIST = [
  'Call02Icon',
  'CustomerSupportIcon',
  'BookOpen02Icon',
  'AtIcon',
  'Search01Icon',
] as const

export type HugeiconsAllowlistName = (typeof HUGEICONS_ALLOWLIST)[number]

const hugeiconsAllowlistSet = new Set<string>(HUGEICONS_ALLOWLIST)

/** Validates that a string is an allowlisted Hugeicons icon name. */
export function isHugeiconsAllowlistName(value: string): value is HugeiconsAllowlistName {
  return hugeiconsAllowlistSet.has(value)
}
