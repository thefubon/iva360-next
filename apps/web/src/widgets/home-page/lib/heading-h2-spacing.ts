import type { CSSProperties } from 'react'

export const HEADING_H2_DESKTOP_SPACING_DEFAULT = 24
export const HEADING_H2_TABLET_SPACING = 24
export const HEADING_H2_MOBILE_SPACING = 16

export function resolveHeadingH2DesktopSpacing(
  value: number | null | undefined,
): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  return HEADING_H2_DESKTOP_SPACING_DEFAULT
}

export function getHeadingH2SpacingStyle(
  spacingTop: number | null | undefined,
  spacingBottom: number | null | undefined,
): CSSProperties {
  return {
    '--h2-spacing-top': `${resolveHeadingH2DesktopSpacing(spacingTop)}px`,
    '--h2-spacing-bottom': `${resolveHeadingH2DesktopSpacing(spacingBottom)}px`,
  } as CSSProperties
}
