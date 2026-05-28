'use client'

import type { BrandIconInput } from '@iva360/shared'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  type ReactSelectOption,
  fieldBaseClass,
  useField,
} from '@payloadcms/ui'
import type { UploadFieldClientComponent } from 'payload'
import { useCallback, useMemo, useState } from 'react'
import { components as selectComponents, type OptionProps, type SingleValueProps } from 'react-select'

import { resolveBrandMediaId, resolveBrandMediaUrl } from '@/lib/brand/brand-icon-media'
import { useBrandGlobal } from '@/lib/brand/use-brand-global'

type BrandIconOption = ReactSelectOption<string> & {
  imageUrl: string | null
}

const optionRowStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: '0.625rem',
}

function BrandIconPreview({
  imageUrl,
  size = 20,
}: {
  imageUrl: string | null
  size?: number
}) {
  if (!imageUrl) {
    return (
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          flexShrink: 0,
          height: size,
          width: size,
        }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin icon preview
    <img
      alt=""
      height={size}
      src={imageUrl}
      style={{ flexShrink: 0, objectFit: 'contain' }}
      width={size}
    />
  )
}

function BrandIconOptionRow(props: OptionProps<BrandIconOption>) {
  return (
    <selectComponents.Option {...props}>
      <span style={optionRowStyle}>
        <BrandIconPreview imageUrl={props.data.imageUrl} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.Option>
  )
}

function BrandIconSingleValue(props: SingleValueProps<BrandIconOption>) {
  return (
    <selectComponents.SingleValue {...props}>
      <span style={optionRowStyle}>
        <BrandIconPreview imageUrl={props.data.imageUrl} size={18} />
        <span>{String(props.data.label)}</span>
      </span>
    </selectComponents.SingleValue>
  )
}

const brandIconSelectComponents = {
  Option: BrandIconOptionRow,
  SingleValue: BrandIconSingleValue,
}

function toBrandIconOption(item: BrandIconInput): BrandIconOption | null {
  if (!item.id) {
    return null
  }

  return {
    label: item.name,
    value: item.id,
    imageUrl: resolveBrandMediaUrl(item.image),
  }
}

function filterBrandIcons(items: BrandIconInput[], query: string): BrandIconInput[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter((item) => item.name.toLowerCase().includes(normalized))
}

/** Upload field UI: Payload ReactSelect from Brand → Иконки (no file upload). */
export const BrandIconSelectField: UploadFieldClientComponent = (props) => {
  const {
    field: { admin, label, required },
    path,
    readOnly,
    showError,
    errorMessage,
  } = props
  const { setValue, value } = useField<number | Record<string, unknown>>({ path })
  const { brand, isLoading } = useBrandGlobal()
  const [search, setSearch] = useState('')
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const brandIcons = brand?.icons ?? []
  const currentMediaId = resolveBrandMediaId(value)

  const selectedIconId = useMemo(() => {
    if (!currentMediaId) {
      return null
    }

    const match = brandIcons.find((item) => resolveBrandMediaId(item.image) === currentMediaId)
    return match?.id ?? null
  }, [brandIcons, currentMediaId])

  const visibleIcons = useMemo(() => filterBrandIcons(brandIcons, search), [brandIcons, search])

  const options = useMemo(
    () =>
      visibleIcons
        .map(toBrandIconOption)
        .filter((option): option is BrandIconOption => option !== null),
    [visibleIcons],
  )

  const selectedOption = useMemo(() => {
    if (!selectedIconId) {
      return undefined
    }

    const item = brandIcons.find((icon) => icon.id === selectedIconId)
    if (!item) {
      return undefined
    }

    return toBrandIconOption(item) ?? undefined
  }, [brandIcons, selectedIconId])

  const onChange = useCallback(
    (selected: ReactSelectOption | ReactSelectOption[]) => {
      if (readOnly || isLoading || Array.isArray(selected)) {
        return
      }

      if (!selected) {
        setValue(null)
        setSearch('')
        return
      }

      const preset = brandIcons.find((item) => item.id === selected.value)
      const mediaId = resolveBrandMediaId(preset?.image)
      setValue(mediaId ?? null)
      setSearch('')
    },
    [brandIcons, isLoading, readOnly, setValue],
  )

  return (
    <div className={`${fieldBaseClass} brand-icon-select-field`}>
      <FieldLabel label={label} path={path} required={required} />
      {admin?.description ? <FieldDescription description={admin.description} path={path} /> : null}
      <div className={`${fieldBaseClass}__wrap`}>
        {showError ? <FieldError message={errorMessage} path={path} showError={showError} /> : null}
        {brandIcons.length === 0 ? (
          <p style={{ color: 'var(--theme-elevation-500)', margin: 0 }}>
            Сначала добавьте иконки в разделе «Настройки → Бренд → Иконки».
          </p>
        ) : (
          <ReactSelect
            components={brandIconSelectComponents}
            disabled={Boolean(readOnly) || isLoading}
            filterOption={() => true}
            isClearable
            isSearchable
            menuIsOpen={menuIsOpen}
            noOptionsMessage={() =>
              search.trim() ? 'Иконка не найдена.' : 'Начните вводить название…'
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
            placeholder="Выберите иконку…"
            value={selectedOption}
          />
        )}
      </div>
    </div>
  )
}
