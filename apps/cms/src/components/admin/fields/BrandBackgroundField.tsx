'use client'

import type { BrandBackgroundInput } from '@iva360/shared'
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

type BrandBackgroundOption = ReactSelectOption<string> & {
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

function BrandBackgroundOptionRow(props: OptionProps<BrandBackgroundOption>) {
  return (
    <selectComponents.Option {...props}>
      <span style={optionRowStyle}>
        <ColorSwatch color={props.data.hex} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.Option>
  )
}

function BrandBackgroundSingleValue(props: SingleValueProps<BrandBackgroundOption>) {
  return (
    <selectComponents.SingleValue {...props}>
      <span style={optionRowStyle}>
        <ColorSwatch color={props.data.hex} size={18} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.SingleValue>
  )
}

const brandBackgroundSelectComponents = {
  Option: BrandBackgroundOptionRow,
  SingleValue: BrandBackgroundSingleValue,
}

function toBrandBackgroundOption(item: BrandBackgroundInput): BrandBackgroundOption | null {
  if (!item.id) {
    return null
  }

  return {
    label: item.name,
    value: item.id,
    hex: item.color,
  }
}

function filterBrandBackgrounds(items: BrandBackgroundInput[], query: string): BrandBackgroundInput[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.color.toLowerCase().includes(normalized),
  )
}

type BrandBackgroundStoreAs = 'id' | 'color'

function resolveStoreAs(field: { custom?: { storeAs?: BrandBackgroundStoreAs } }): BrandBackgroundStoreAs {
  return field.custom?.storeAs === 'id' ? 'id' : 'color'
}

/** Text field UI: Payload ReactSelect from Brand → Фон. */
export const BrandBackgroundField: TextFieldClientComponent = (props) => {
  const {
    field,
    field: { admin, label, required },
    path,
    readOnly,
    showError,
    errorMessage,
  } = props
  const storeAs = resolveStoreAs(field)
  const showCustomColor = storeAs === 'color'
  const { setValue, value } = useField<string>({ path })
  const { brand, isLoading } = useBrandGlobal()
  const [search, setSearch] = useState('')
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const brandBackgrounds = brand?.backgrounds ?? []
  const stringValue = typeof value === 'string' ? value.trim() : ''

  const selectedBackgroundId = useMemo(() => {
    if (!stringValue) {
      return null
    }

    if (storeAs === 'id') {
      return brandBackgrounds.some((item) => item.id === stringValue) ? stringValue : null
    }

    const match = brandBackgrounds.find(
      (item) => item.color.toLowerCase() === stringValue.toLowerCase(),
    )
    return match?.id ?? null
  }, [brandBackgrounds, storeAs, stringValue])

  const visibleBackgrounds = useMemo(
    () => filterBrandBackgrounds(brandBackgrounds, search),
    [brandBackgrounds, search],
  )

  const options = useMemo(
    () =>
      visibleBackgrounds
        .map(toBrandBackgroundOption)
        .filter((option): option is BrandBackgroundOption => option !== null),
    [visibleBackgrounds],
  )

  const selectedOption = useMemo(() => {
    if (!selectedBackgroundId) {
      return undefined
    }

    const item = brandBackgrounds.find((background) => background.id === selectedBackgroundId)
    if (!item) {
      return undefined
    }

    return toBrandBackgroundOption(item) ?? undefined
  }, [brandBackgrounds, selectedBackgroundId])

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

      const preset = brandBackgrounds.find((item) => item.id === selected.value)
      setValue(storeAs === 'id' ? (preset?.id ?? '') : (preset?.color ?? ''))
      setSearch('')
    },
    [brandBackgrounds, isLoading, readOnly, setValue, storeAs],
  )

  const { description, style, width } = admin ?? {}

  return (
    <div
      className={`${fieldBaseClass} brand-background-select-field`}
      style={{
        ...(style ?? {}),
        ...(width ? { ['--field-width' as string]: String(width), minWidth: 0 } : {}),
      }}
    >
      <FieldLabel label={label} path={path} required={required} />
      {description ? <FieldDescription description={description} path={path} /> : null}
      <div className={`${fieldBaseClass}__wrap`}>
        {showError ? <FieldError message={errorMessage} path={path} showError={showError} /> : null}
        {brandBackgrounds.length === 0 ? (
          <p style={{ color: 'var(--theme-elevation-500)', margin: '0 0 0.75rem' }}>
            {showCustomColor
              ? 'Сначала добавьте фоны в разделе «Настройки → Бренд → Фон» или укажите свой цвет ниже.'
              : 'Сначала добавьте фоны в разделе «Настройки → Бренд → Фон».'}
          </p>
        ) : (
          <ReactSelect
            components={brandBackgroundSelectComponents}
            disabled={Boolean(readOnly) || isLoading}
            filterOption={() => true}
            isClearable
            isSearchable
            menuIsOpen={menuIsOpen}
            noOptionsMessage={() =>
              search.trim() ? 'Фон не найден.' : 'Начните вводить название…'
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
            placeholder="Выберите фон…"
            value={selectedOption}
          />
        )}
        {showCustomColor ? (
          <div style={{ marginTop: brandBackgrounds.length === 0 ? 0 : '0.75rem' }}>
            <FieldLabel label="Свой цвет" path={`${path}-custom`} />
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <input
                aria-label="Свой цвет фона"
                disabled={Boolean(readOnly) || isLoading}
                onChange={(event) => {
                  setValue(event.target.value)
                }}
                style={{
                  blockSize: '2.5rem',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 'var(--border-radius-s)',
                  cursor: readOnly ? 'not-allowed' : 'pointer',
                  inlineSize: '2.5rem',
                  padding: 0,
                }}
                type="color"
                value={
                  /^#[0-9A-Fa-f]{6}$/.test(stringValue)
                    ? stringValue
                    : /^#[0-9A-Fa-f]{3}$/.test(stringValue)
                      ? `#${stringValue[1]}${stringValue[1]}${stringValue[2]}${stringValue[2]}${stringValue[3]}${stringValue[3]}`
                      : '#FFFFFF'
                }
              />
              <input
                disabled={Boolean(readOnly) || isLoading}
                onChange={(event) => {
                  setValue(event.target.value)
                }}
                placeholder="#FFFFFF"
                spellCheck={false}
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-mono)',
                }}
                type="text"
                value={stringValue}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
