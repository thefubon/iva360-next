'use client'

import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, useConfig, useTheme } from '@payloadcms/ui'
import React, { useCallback } from 'react'

export const ThemeToggleButton: React.FC = () => {
  const {
    config: {
      admin: { theme: adminTheme = 'all' },
    },
  } = useConfig()
  const { setTheme, theme } = useTheme()

  const isDark = theme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const tooltip = isDark ? 'Включить светлую тему' : 'Включить тёмную тему'

  const handleClick = useCallback(() => {
    setTheme(nextTheme)
  }, [nextTheme, setTheme])

  if (adminTheme !== 'all') {
    return null
  }

  return (
    <Button
      aria-label={tooltip}
      buttonStyle="secondary"
      icon={
        <HugeiconsIcon
          icon={isDark ? Sun01Icon : Moon02Icon}
          size={16}
          strokeWidth={1.75}
        />
      }
      iconStyle="without-border"
      margin={false}
      onClick={handleClick}
      size="small"
      tooltip={tooltip}
    />
  )
}
