'use client'

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type LivePreviewRefreshProps = {
  serverURL: string
}

function resolveLivePreviewServerURL(configuredServerURL: string): string {
  if (typeof window === 'undefined') {
    return configuredServerURL
  }

  if (window.self === window.top) {
    return configuredServerURL
  }

  try {
    // Admin opened via /admin rewrite on the same origin as the preview iframe.
    if (window.parent.location.origin === window.location.origin) {
      return window.location.origin
    }
  } catch {
    // Cross-origin parent — use configured Payload admin origin.
  }

  return configuredServerURL
}

export function LivePreviewRefresh({ serverURL }: LivePreviewRefreshProps) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [resolvedServerURL, setResolvedServerURL] = useState(serverURL)

  useEffect(() => {
    if (window.self === window.top) {
      return
    }

    setResolvedServerURL(resolveLivePreviewServerURL(serverURL))
    setActive(true)
  }, [serverURL])

  if (!active) {
    return null
  }

  return (
    <PayloadRefreshRouteOnSave refresh={() => router.refresh()} serverURL={resolvedServerURL} />
  )
}
