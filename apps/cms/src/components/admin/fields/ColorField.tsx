'use client'

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  fieldBaseClass,
  useField,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useCallback } from 'react'

const DEFAULT_COLOR = '#000000'

function toSixDigitHex(value: string): string {
  const trimmed = value.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return trimmed
  }

  const short = trimmed.match(/^#([0-9A-Fa-f]{3})$/)
  if (short) {
    const [r, g, b] = short[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`
  }

  return DEFAULT_COLOR
}

function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim())
}

export const ColorField: TextFieldClientComponent = (props) => {
  const {
    field: { admin, label, required },
    path,
    readOnly,
  } = props
  const { setValue, showError, errorMessage, value } = useField<string>({ path })

  const stringValue = typeof value === 'string' ? value : ''
  const pickerValue = isValidHex(stringValue) ? toSixDigitHex(stringValue) : DEFAULT_COLOR

  const onPickerChange = useCallback(
    (next: string) => {
      setValue(next)
    },
    [setValue],
  )

  const onTextChange = useCallback(
    (next: string) => {
      setValue(next)
    },
    [setValue],
  )

  return (
    <div className={`${fieldBaseClass} color-field`}>
      <FieldLabel label={label} required={required} path={path} />
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <input
          aria-label={typeof label === 'string' ? label : 'Цвет'}
          disabled={Boolean(readOnly)}
          onChange={(event) => onPickerChange(event.target.value)}
          style={{
            blockSize: '2.5rem',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--border-radius-s)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            inlineSize: '2.5rem',
            padding: 0,
          }}
          type="color"
          value={pickerValue}
        />
        <input
          disabled={Boolean(readOnly)}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="#000000"
          spellCheck={false}
          style={{
            flex: 1,
            fontFamily: 'var(--font-mono)',
          }}
          type="text"
          value={stringValue}
        />
      </div>
      {admin?.description ? <FieldDescription description={admin.description} path={path} /> : null}
      {showError ? <FieldError message={errorMessage} path={path} /> : null}
    </div>
  )
}
