'use client'

import { useRowLabel } from '@payloadcms/ui'

type CardRowData = {
  title?: string | null
}

export const CardRowLabel = () => {
  const { data, rowNumber } = useRowLabel<CardRowData>()

  const title = data?.title?.trim()

  if (title) {
    return <span>{title}</span>
  }

  if (typeof rowNumber === 'number') {
    return <span>Карточка {String(rowNumber + 1).padStart(2, '0')}</span>
  }

  return <span>Новая карточка</span>
}
