'use client'

import { useRowLabel } from '@payloadcms/ui'

type LinkRowData = {
  number?: string | null
}

export const LinkRowLabel = () => {
  const { data, rowNumber } = useRowLabel<LinkRowData>()

  const number = data?.number?.trim()

  if (number) {
    return <span>{number}</span>
  }

  if (typeof rowNumber === 'number') {
    return <span>Ссылка {String(rowNumber + 1).padStart(2, '0')}</span>
  }

  return <span>Новая ссылка</span>
}
