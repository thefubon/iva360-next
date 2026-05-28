'use client'

import type { BrandColorInput } from '@iva360/shared'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  type ReactSelectOption,
  fieldBaseClass,
  useField,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useCallback, useMemo, useState } from 'react'
import { components as selectComponents, type OptionProps, type SingleValueProps } from 'react-select'

import { useBrandGlobal } from '@/lib/brand/use-brand-global'

type BrandColorOption = ReactSelectOption<string> & {
  hex: string
}

const optionRowStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: '0.625rem',
}

function ColorSwatch({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        backgroundColor: color,
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--border-radius-s)',
        display: 'inline-block',
        flexShrink: 0,
        height: size,
        width: size,
      }}
    />
  )
}

function BrandColorOptionRow(props: OptionProps<BrandColorOption>) {
  return (
    <selectComponents.Option {...props}>
      <span style={optionRowStyle}>
        <ColorSwatch color={props.data.hex} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.Option>
  )
}

function BrandColorSingleValue(props: SingleValueProps<BrandColorOption>) {
  return (
    <selectComponents.SingleValue {...props}>
      <span style={optionRowStyle}>
        <ColorSwatch color={props.data.hex} size={18} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.SingleValue>
  )
}

const brandColorSelectComponents = {
  Option: BrandColorOptionRow,
  SingleValue: BrandColorSingleValue,
}

function toBrandColorOption(item: BrandColorInput): BrandColorOption | null {
  if (!item.id) {
    return null
  }

  return {
    label: item.name,
    value: item.id,
    hex: item.value,
  }
}

function filterBrandColors(items: BrandColorInput[], query: string): BrandColorInput[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.value.toLowerCase().includes(normalized),
  )
}

/** Text field UI: Payload ReactSelect from Brand → Цвета. */
export const BrandColorField: TextFieldClientComponent = (props) => {
  const {
    field: { admin, label, required },
    path,
    readOnly,
    showError,
    errorMessage,
  } = props
  const { setValue, value } = useField<string>({ path })
  const { brand, isLoading } = useBrandGlobal()
  const [search, setSearch] = useState('')
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const brandColors = brand?.colors ?? []
  const stringValue = typeof value === 'string' ? value.trim() : ''

  const selectedColorId = useMemo(() => {
    if (!stringValue) {
      return null
    }

    const match = brandColors.find(
      (item) => item.value.toLowerCase() === stringValue.toLowerCase(),
    )
    return match?.id ?? null
  }, [brandColors, stringValue])

  const visibleColors = useMemo(() => filterBrandColors(brandColors, search), [brandColors, search])

  const options = useMemo(
    () =>
      visibleColors
        .map(toBrandColorOption)
        .filter((option): option is BrandColorOption => option !== null),
    [visibleColors],
  )

  const selectedOption = useMemo(() => {
    if (!selectedColorId) {
      return undefined
    }

    const item = brandColors.find((color) => color.id === selectedColorId)
    if (!item) {
      return undefined
    }

    return toBrandColorOption(item) ?? undefined
  }, [brandColors, selectedColorId])

  const onChange = useCallback(
    (selected: ReactSelectOption | ReactSelectOption[]) => {
      if (readOnly || isLoading || Array.isArray(selected)) {
        return
      }

      if (!selected) {
        setValue('')
        setSearch('')
        return
      }

      const preset = brandColors.find((item) => item.id === selected.value)
      setValue(preset?.value ?? '')
      setSearch('')
    },
    [brandColors, isLoading, readOnly, setValue],
  )

  const { description, style, width } = admin ?? {}

  return (
    <div
      className={`${fieldBaseClass} brand-color-select-field`}
      style={{
        ...(style ?? {}),
        ...(width ? { ['--field-width' as string]: String(width), minWidth: 0 } : {}),
      }}
    >
      <FieldLabel label={label} path={path} required={required} />
      {description ? <FieldDescription description={description} path={path} /> : null}
      <div className={`${fieldBaseClass}__wrap`}>
        {showError ? <FieldError message={errorMessage} path={path} showError={showError} /> : null}
        {brandColors.length === 0 ? (
          <p style={{ color: 'var(--theme-elevation-500)', margin: 0 }}>
            Сначала добавьте цвета в разделе «Настройки → Бренд → Цвет».
          </p>
        ) : (
          <ReactSelect
            components={brandColorSelectComponents}
            disabled={Boolean(readOnly) || isLoading}
            filterOption={() => true}
            isClearable
            isSearchable
            menuIsOpen={menuIsOpen}
            noOptionsMessage={() =>
              search.trim() ? 'Цвет не найден.' : 'Начните вводить название…'
            }
            onChange={onChange}
            onInputChange={(inputValue) => {
              setSearch(inputValue)
            }}
            onMenuClose={() => {
              setMenuIsOpen(false)
              setSearch('')
            }}
            onMenuOpen={() => {
              setMenuIsOpen(true)
              setSearch('')
            }}
            options={options}
            placeholder="Выберите цвет…"
            value={selectedOption}
          />
        )}
      </div>
    </div>
  )
}
