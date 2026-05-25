'use client'

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  HUGEICONS_FREE_ICON_NAMES,
  TOPBAR_PHONE_HUGEICONS_DEFAULTS,
} from '@iva360/shared/schemas'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  type ReactSelectOption,
  RenderCustomComponent,
  fieldBaseClass,
  useField,
  withCondition,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { components as selectComponents, type OptionProps, type SingleValueProps } from 'react-select'

const MAX_VISIBLE_OPTIONS = 50

type IconsRegistry = Record<string, IconSvgElement>
type SelectOption = ReactSelectOption<string>

const optionRowStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: '0.5rem',
}

function filterIconNames(search: string, selectedValue?: string | null): string[] {
  const query = search.trim().toLowerCase()

  if (!query) {
    const defaults = TOPBAR_PHONE_HUGEICONS_DEFAULTS.slice(0, MAX_VISIBLE_OPTIONS)
    if (defaults.length >= MAX_VISIBLE_OPTIONS) {
      return defaults
    }

    const defaultsSet = new Set<string>(defaults)
    const filler = HUGEICONS_FREE_ICON_NAMES.filter((name) => !defaultsSet.has(name))
    return [...defaults, ...filler].slice(0, MAX_VISIBLE_OPTIONS)
  }

  const matches: string[] = []

  for (const name of HUGEICONS_FREE_ICON_NAMES) {
    if (name.toLowerCase().includes(query)) {
      matches.push(name)
      if (matches.length >= MAX_VISIBLE_OPTIONS) {
        break
      }
    }
  }

  if (
    selectedValue &&
    !matches.includes(selectedValue) &&
    selectedValue.toLowerCase().includes(query)
  ) {
    return [selectedValue, ...matches.filter((name) => name !== selectedValue)].slice(
      0,
      MAX_VISIBLE_OPTIONS,
    )
  }

  return matches
}

function IconPreview({
  iconsRegistry,
  name,
  size = 18,
}: {
  iconsRegistry: IconsRegistry | null
  name: string
  size?: number
}) {
  const placeholder = (
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

  if (!iconsRegistry) {
    return placeholder
  }

  const icon = iconsRegistry[name]
  if (!icon) {
    return placeholder
  }

  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.75} />
}

function createSelectComponents(iconsRegistry: IconsRegistry | null) {
  const IconOption = (optionProps: OptionProps<SelectOption>) => (
    <selectComponents.Option {...optionProps}>
      <span style={optionRowStyle}>
        <IconPreview iconsRegistry={iconsRegistry} name={String(optionProps.data.value)} />
        <span>{String(optionProps.data.label)}</span>
      </span>
    </selectComponents.Option>
  )

  const IconSingleValue = (singleValueProps: SingleValueProps<SelectOption>) => (
    <selectComponents.SingleValue {...singleValueProps}>
      <span style={optionRowStyle}>
        <IconPreview iconsRegistry={iconsRegistry} name={String(singleValueProps.data.value)} />
        <span>{String(singleValueProps.data.label)}</span>
      </span>
    </selectComponents.SingleValue>
  )

  return {
    Option: IconOption,
    SingleValue: IconSingleValue,
  }
}

const HugeiconsPickerComponent: TextFieldClientComponent = (props) => {
  const {
    field: {
      admin: { className, description, style, width } = {},
      label,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const memoizedValidate = useCallback(
    (fieldValue: unknown, options: Record<string, unknown>) => {
      if (typeof validate === 'function') {
        return validate(fieldValue as string, { ...options, required } as Parameters<
          NonNullable<typeof validate>
        >[1])
      }

      return true
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const [search, setSearch] = useState('')
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [iconsRegistry, setIconsRegistry] = useState<IconsRegistry | null>(null)

  const selectedValue = typeof value === 'string' ? value : null
  const shouldLoadIcons = menuIsOpen || Boolean(selectedValue)
  const iconsLoading = shouldLoadIcons && !iconsRegistry

  useEffect(() => {
    if (iconsRegistry || !shouldLoadIcons) {
      return
    }

    let cancelled = false

    void import('@hugeicons/core-free-icons')
      .then((module) => {
        if (!cancelled) {
          setIconsRegistry(module as IconsRegistry)
        }
      })

    return () => {
      cancelled = true
    }
  }, [shouldLoadIcons, iconsRegistry])

  const visibleNames = useMemo(() => {
    const names = filterIconNames(search, selectedValue)

    if (selectedValue && !search.trim() && !names.includes(selectedValue)) {
      return [selectedValue, ...names.filter((name) => name !== selectedValue)].slice(
        0,
        MAX_VISIBLE_OPTIONS,
      )
    }

    return names
  }, [search, selectedValue])

  const options = useMemo(
    () => visibleNames.map((name) => ({ label: name, value: name })),
    [visibleNames],
  )

  const selectedOption = useMemo<SelectOption | undefined>(() => {
    if (!selectedValue) {
      return undefined
    }

    return { label: selectedValue, value: selectedValue }
  }, [selectedValue])

  const selectComponentsWithIcons = useMemo(
    () => createSelectComponents(iconsRegistry),
    [iconsRegistry],
  )

  const onChange = useCallback(
    (selected: ReactSelectOption | ReactSelectOption[]) => {
      if (readOnly || disabled || Array.isArray(selected)) {
        return
      }

      setValue((selected.value as string) ?? null)
      setSearch('')
    },
    [disabled, readOnly, setValue],
  )

  const searchHint =
    search.trim().length === 0
      ? `Показаны ${visibleNames.length} из ${HUGEICONS_FREE_ICON_NAMES.length}. Введите название для поиска.`
      : visibleNames.length >= MAX_VISIBLE_OPTIONS
        ? `Показаны первые ${MAX_VISIBLE_OPTIONS} совпадений. Уточните запрос.`
        : undefined

  return (
    <div
      className={[fieldBaseClass, 'text', className, showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
      style={{
        ...(style || {}),
        ...(width ? { ['--field-width' as string]: String(width) } : { flex: '1 1 auto' }),
      }}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={<FieldLabel label={label} path={path} required={required} />}
      />
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        <RenderCustomComponent CustomComponent={BeforeInput} Fallback={null} />
        <ReactSelect
          components={selectComponentsWithIcons}
          disabled={disabled || readOnly}
          filterOption={() => true}
          isClearable={false}
          isLoading={iconsLoading}
          isSearchable
          menuIsOpen={menuIsOpen}
          noOptionsMessage={() =>
            search.trim()
              ? 'Ничего не найдено. Попробуйте другой запрос.'
              : 'Начните вводить название иконки…'
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
          }}
          options={options}
          placeholder="Выберите иконку…"
          value={selectedOption}
        />
        {searchHint && menuIsOpen && (
          <p
            style={{
              color: 'var(--theme-elevation-500)',
              fontSize: '0.75rem',
              margin: '0.35rem 0 0',
            }}
          >
            {searchHint}
          </p>
        )}
        <RenderCustomComponent CustomComponent={AfterInput} Fallback={null} />
      </div>
    </div>
  )
}

export const HugeiconsPicker = withCondition(HugeiconsPickerComponent)
