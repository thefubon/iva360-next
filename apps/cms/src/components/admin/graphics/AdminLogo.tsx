import type { ServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { AdminLogoSvg } from './AdminLogoSvg'

const logoStyles = `
.admin-logo {
  align-items: center;
  cursor: pointer;
  display: flex;
  line-height: 1;
  min-width: 0;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.admin-logo svg {
  display: block;
  height: 1.75rem;
  max-width: 100%;
  width: auto;
}

.login .admin-logo svg,
.login__brand .admin-logo svg {
  height: 4.5rem;
}

.admin-logo__iva,
.admin-logo__360 {
  fill: #0f172b;
}

html[data-theme='dark'] .admin-logo__iva,
html[data-theme='dark'] .admin-logo__360 {
  fill: #fafcfb;
}

.admin-logo:hover,
.admin-logo:active {
  opacity: 0.75;
}
`

export const AdminLogo: React.FC<ServerProps> = ({ i18n, payload }) => {
  const { t } = i18n
  const href = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: '',
  })

  return (
    <>
      <style>{logoStyles}</style>
      <a className="admin-logo" href={href} title={t('general:dashboard')}>
        <AdminLogoSvg />
      </a>
    </>
  )
}
