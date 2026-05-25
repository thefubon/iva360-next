'use client'

import { Button, ExternalLinkIcon } from '@payloadcms/ui'
import React from 'react'

type OpenSiteButtonProps = {
  href: string
}

export const OpenSiteButton: React.FC<OpenSiteButtonProps> = ({ href }) => (
  <Button
    aria-label="Открыть сайт"
    buttonStyle="secondary"
    el="anchor"
    icon={<ExternalLinkIcon />}
    iconStyle="without-border"
    margin={false}
    newTab
    size="small"
    tooltip="Открыть сайт"
    url={href}
  />
)
