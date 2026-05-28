'use client'

import { useRowLabel } from '@payloadcms/ui'

type BrandRowData = {
  name?: string | null
}

export const BrandRowLabel = () => {
  const { data, rowNumber } = useRowLabel<BrandRowData>()

  const name = data?.name?.trim()

  if (name) {
    return <span>{name}</span>
  }

  if (typeof rowNumber === 'number') {
    return <span>Элемент {String(rowNumber + 1).padStart(2, '0')}</span>
  }

  return <span>Новый элемент</span>
}
