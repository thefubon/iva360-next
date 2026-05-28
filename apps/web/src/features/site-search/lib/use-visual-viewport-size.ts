'use client'

import { useEffect, useState } from 'react'

type VisualViewportSize = {
  height: number
  offsetTop: number
}

function readVisualViewportSize(): VisualViewportSize {
  if (typeof window === 'undefined') {
    return { height: 0, offsetTop: 0 }
  }

  const viewport = window.visualViewport

  if (!viewport) {
    return {
      height: window.innerHeight,
      offsetTop: 0,
    }
  }

  return {
    height: viewport.height,
    offsetTop: viewport.offsetTop,
  }
}

export function useVisualViewportSize(enabled: boolean): VisualViewportSize {
  const [size, setSize] = useState<VisualViewportSize>(() => readVisualViewportSize())

  useEffect(() => {
    if (!enabled) {
      return
    }

    const viewport = window.visualViewport
    const update = () => {
      setSize(readVisualViewportSize())
    }

    update()
    viewport?.addEventListener('resize', update)
    viewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      viewport?.removeEventListener('resize', update)
      viewport?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [enabled])

  return size
}
