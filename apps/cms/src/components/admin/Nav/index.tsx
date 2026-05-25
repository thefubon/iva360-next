import { DefaultNavClient, NavHamburger, NavWrapper } from '@payloadcms/next/client'
import { Logo } from '@payloadcms/next/rsc'
import { SettingsMenuButton } from './SettingsMenuButton'
import { OpenSiteButton } from './OpenSiteButton'
import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import type { EntityToGroup } from '@payloadcms/ui/shared'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import type { PayloadRequest, ServerProps } from 'payload'
import React from 'react'

import { sortNavGroups } from '../../../admin/navGroupOrder'
import { getWebPublicUrl } from '../../../lib/webPublicUrl'
import { getNavPrefs } from './getNavPrefs'

const baseClass = 'nav'

type NavProps = {
  req?: PayloadRequest
} & ServerProps

export const AdminNav: React.FC<NavProps> = async (props) => {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    req,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config || !permissions || !visibleEntities) {
    return null
  }

  const {
    admin: {
      components: { afterNav, afterNavLinks, beforeNav, beforeNavLinks, logout, settingsMenu },
    },
    collections,
    globals,
  } = payload.config

  const entities: EntityToGroup[] = [
    ...globals
      .filter(({ slug }) => visibleEntities.globals.includes(slug))
      .map(
        (global) =>
          ({
            type: EntityType.global,
            entity: global,
          }) satisfies EntityToGroup,
      ),
    ...collections
      .filter(({ slug }) => visibleEntities.collections.includes(slug))
      .map(
        (collection) =>
          ({
            type: EntityType.collection,
            entity: collection,
          }) satisfies EntityToGroup,
      ),
  ]

  const groups = sortNavGroups(groupNavItems(entities, permissions, i18n))
  const navPreferences = req ? await getNavPrefs(req) : null

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedSettingsMenu =
    settingsMenu && Array.isArray(settingsMenu)
      ? settingsMenu.map((item, index) =>
          RenderServerComponent({
            clientProps: {
              documentSubViewType,
              viewType,
            },
            Component: item,
            importMap: payload.importMap,
            key: `settings-menu-item-${index}`,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            },
          }),
        )
      : []

  const RenderedBeforeNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedBeforeNavLinks = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNavLinks,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedAfterNavLinks = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: afterNavLinks,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedAfterNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: afterNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  return (
    <NavWrapper baseClass={baseClass}>
      {RenderedBeforeNav}
      <nav className={`${baseClass}__wrap`}>
        {RenderedBeforeNavLinks}
        <DefaultNavClient groups={groups} navPreferences={navPreferences} />
        {RenderedAfterNavLinks}
        <div className={`${baseClass}__controls`}>
          <SettingsMenuButton settingsMenu={RenderedSettingsMenu} />
          {LogoutComponent}
        </div>
      </nav>
      {RenderedAfterNav}
      <div className={`${baseClass}__header`}>
        <div
          className={`${baseClass}__header-content`}
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            width: '100%',
          }}
        >
          <div
            aria-hidden="true"
            style={{ flexShrink: 0, width: '2.25rem' }}
          />
          <div style={{ alignItems: 'center', display: 'flex', minWidth: 0 }}>
            <Logo
              i18n={i18n}
              locale={locale}
              params={params}
              payload={payload}
              permissions={permissions}
              searchParams={searchParams}
              user={user}
            />
          </div>
          <div style={{ flex: '1 1 auto' }} />
          <OpenSiteButton href={getWebPublicUrl()} />
          <NavHamburger baseClass={baseClass} />
        </div>
      </div>
    </NavWrapper>
  )
}
