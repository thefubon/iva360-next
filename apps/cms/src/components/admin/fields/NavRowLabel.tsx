'use client'

import { useRowLabel } from '@payloadcms/ui'

type NavRowData = {
  label?: string | null
}

export const NavRowLabel = () => {
  const { data, rowNumber } = useRowLabel<NavRowData>()

  const label = data?.label?.trim()

  if (label) {
    return <span>{label}</span>
  }

  if (typeof rowNumber === 'number') {
    return <span>Пункт {String(rowNumber + 1).padStart(2, '0')}</span>
  }

  return <span>Новый пункт</span>
}
