'use client'

import { Button, Gutter, useConfig, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React, { useEffect, useMemo } from 'react'

import {
  getSearchResultAdminPath,
  getSearchResultDestinationLabel,
} from '../../../lib/search/search-result-url'

export const SearchResultEditView = () => {
  const router = useRouter()
  const { config } = useConfig()
  const { data, isInitializing, title } = useDocumentInfo()
  const {
    routes: { admin: adminRoute },
    serverURL,
  } = config

  const targetPath = useMemo(() => getSearchResultAdminPath(data ?? {}), [data])

  const href = useMemo(() => {
    if (!targetPath) {
      return null
    }

    return formatAdminURL({
      adminRoute,
      path: targetPath,
      serverURL,
    })
  }, [adminRoute, serverURL, targetPath])

  useEffect(() => {
    if (isInitializing || !href) {
      return
    }

    router.replace(href)
  }, [href, isInitializing, router])

  const destinationLabel = getSearchResultDestinationLabel(data ?? {})
  const displayTitle = typeof title === 'string' && title.trim() ? title : 'Результат поиска'

  return (
    <Gutter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '40rem',
          paddingBlock: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {displayTitle}
        </h1>

        {href ? (
          <>
            <p
              style={{
                color: 'var(--theme-elevation-500)',
                margin: 0,
              }}
            >
              {isInitializing
                ? 'Загрузка…'
                : `Переход к настройке «${destinationLabel}»…`}
            </p>
            <div>
              <Button
                buttonStyle="primary"
                onClick={() => {
                  router.replace(href)
                }}
              >
                Перейти к настройке
              </Button>
            </div>
          </>
        ) : (
          <p
            style={{
              color: 'var(--theme-elevation-500)',
              margin: 0,
            }}
          >
            Не удалось определить, куда перейти из этого результата поиска.
          </p>
        )}
      </div>
    </Gutter>
  )
}
