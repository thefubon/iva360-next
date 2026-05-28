import { getTranslation } from '@payloadcms/translations'
import { Button, Card, Locked } from '@payloadcms/ui'
import {
  EntityType,
  getGlobalData,
  getNavGroups,
  getVisibleEntities,
} from '@payloadcms/ui/shared'
import { getAccessResults } from 'payload'
import { formatAdminURL } from 'payload/shared'
import type { ClientUser, WidgetServerProps } from 'payload'
import React from 'react'

import { sortNavGroups } from '../../../admin/navGroupOrder'

const wrapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--base)',
  width: '100%',
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--base)',
}

const labelStyle: React.CSSProperties = {
  margin: 0,
}

const cardListStyle: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  listStyle: 'none',
  margin: 0,
  padding: 0,
}

export async function CollectionCards(props: WidgetServerProps) {
  const { i18n, payload, user } = props.req
  const { admin: adminRoute } = payload.config.routes
  const { t } = i18n

  const permissions = await getAccessResults({
    req: props.req,
  })
  const visibleEntities = getVisibleEntities({
    req: props.req,
  })
  const globalData = await getGlobalData(props.req)
  const navGroups = sortNavGroups(
    getNavGroups(permissions, visibleEntities, payload.config, i18n),
  )

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={wrapStyle}>
        {!navGroups || navGroups.length === 0 ? (
          <p>Нет доступных разделов.</p>
        ) : (
          navGroups.map(({ entities, label }, groupIndex) => (
            <div key={groupIndex} style={groupStyle}>
              <h2 style={labelStyle}>{label}</h2>
              <ul style={cardListStyle}>
                {entities.map(({ slug, type, label: entityLabel }, entityIndex) => {
                  let title: string
                  let buttonAriaLabel: string
                  let createHREF: string | undefined
                  let href: string
                  let hasCreatePermission: boolean | undefined
                  let isLocked: boolean | null = null
                  let userEditing: ClientUser | number | string | null = null

                  if (type === EntityType.collection) {
                    title = getTranslation(entityLabel, i18n)
                    buttonAriaLabel = t('general:showAllLabel', {
                      label: title,
                    })
                    href = formatAdminURL({
                      adminRoute,
                      path: `/collections/${slug}`,
                    })
                    createHREF = formatAdminURL({
                      adminRoute,
                      path: `/collections/${slug}/create`,
                    })
                    hasCreatePermission = permissions?.collections?.[slug]?.create
                  } else if (type === EntityType.global) {
                    title = getTranslation(entityLabel, i18n)
                    buttonAriaLabel = t('general:editLabel', {
                      label: getTranslation(entityLabel, i18n),
                    })
                    href = formatAdminURL({
                      adminRoute,
                      path: `/globals/${slug}`,
                    })

                    const globalLockData = globalData.find((global) => global.slug === slug)
                    if (globalLockData) {
                      isLocked = globalLockData.data._isLocked
                      userEditing = globalLockData.data._userEditing

                      const lockDuration = globalLockData?.lockDuration ?? 0
                      const lastEditedAt = new Date(globalLockData.data?._lastEditedAt).getTime()
                      const lockDurationInMilliseconds = lockDuration * 1000
                      const lockExpirationTime = lastEditedAt + lockDurationInMilliseconds

                      if (new Date().getTime() > lockExpirationTime) {
                        isLocked = false
                        userEditing = null
                      }
                    }
                  } else {
                    return null
                  }

                  return (
                    <li key={entityIndex}>
                      <Card
                        actions={
                          isLocked &&
                          userEditing &&
                          typeof userEditing === 'object' &&
                          user?.id !== userEditing.id ? (
                            <Locked user={userEditing} />
                          ) : hasCreatePermission && type === EntityType.collection ? (
                            <Button
                              aria-label={t('general:createNewLabel', {
                                label: entityLabel,
                              })}
                              buttonStyle="icon-label"
                              el="link"
                              icon="plus"
                              iconStyle="with-border"
                              round
                              to={createHREF}
                            />
                          ) : undefined
                        }
                        buttonAriaLabel={buttonAriaLabel}
                        href={href}
                        id={`card-${slug}`}
                        title={getTranslation(entityLabel, i18n)}
                        titleAs="h3"
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
