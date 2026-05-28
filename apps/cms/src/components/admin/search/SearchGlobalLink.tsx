'use client'

import { Link, useConfig, useField } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { getGlobalAdminLabel } from '../../../lib/search/search-field-labels'

export const SearchGlobalLink = () => {
  const { config } = useConfig()
  const {
    routes: { admin: adminRoute },
    serverURL,
  } = config
  const { value: globalSlug } = useField<string>({ path: 'globalSlug' })

  if (!globalSlug) {
    return null
  }

  const href = formatAdminURL({
    adminRoute,
    path: `/globals/${globalSlug}`,
    serverURL,
  })
  const label = getGlobalAdminLabel(globalSlug)

  return (
    <div style={{ marginBottom: 'var(--spacing-field, 1rem)' }}>
      <div>
        <span
          className="label"
          style={{
            color: '#9A9A9A',
          }}
        >
          Глобальная настройка
        </span>
      </div>
      <div
        style={{
          fontWeight: '600',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <Link href={href} passHref rel="noopener noreferrer" target="_blank">
          Открыть «{label}»
        </Link>
      </div>
    </div>
  )
}
