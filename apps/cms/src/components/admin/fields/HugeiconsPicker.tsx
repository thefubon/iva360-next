'use client'

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { HUGEICONS_ALLOWLIST, isHugeiconsAllowlistName } from '@iva360/shared/schemas'
import { hugeiconsRegistry } from '@/lib/hugeicons-registry'
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
import React, { useCallback, useMemo, useState } from 'react'
import { components as selectComponents, type OptionProps, type SingleValueProps } from 'react-select'

type IconsRegistry = Record<string, IconSvgElement>
type SelectOption = ReactSelectOption<string>

const optionRowStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: '0.5rem',
}

function filterIconNames(
  allowlist: readonly string[],
  search: string,
  selectedValue?: string | null,
): string[] {
  const query = search.trim().toLowerCase()

  if (!query) {
    return [...allowlist]
  }

  const matches = allowlist.filter((name) => name.toLowerCase().includes(query))

  if (selectedValue && !matches.includes(selectedValue) && selectedValue.toLowerCase().includes(query)) {
    return [selectedValue, ...matches.filter((name) => name !== selectedValue)]
  }

  return [...matches]
}

function IconPreview({
  iconsRegistry,
  name,
  size = 18,
}: {
  iconsRegistry: IconsRegistry
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

  const icon = iconsRegistry[name]
  if (!icon) {
    return placeholder
  }

  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.75} />
}

function createSelectComponents(iconsRegistry: IconsRegistry) {
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

  const selectedValue = typeof value === 'string' ? value : null

  const effectiveSearch = useMemo(() => {
    const trimmed = search.trim()

    if (!trimmed) {
      return ''
    }

    if (selectedValue && trimmed.toLowerCase() === selectedValue.toLowerCase()) {
      return ''
    }

    return search
  }, [search, selectedValue])

  const visibleNames = useMemo(() => {
    if (!effectiveSearch.trim()) {
      const allowlist = [...HUGEICONS_ALLOWLIST]

      if (selectedValue && !isHugeiconsAllowlistName(selectedValue)) {
        return [selectedValue, ...allowlist]
      }

      return allowlist
    }

    return filterIconNames(HUGEICONS_ALLOWLIST, effectiveSearch, selectedValue)
  }, [effectiveSearch, selectedValue])

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
    () => createSelectComponents(hugeiconsRegistry),
    [],
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
    menuIsOpen && effectiveSearch.trim().length === 0
      ? `Доступно ${HUGEICONS_ALLOWLIST.length} иконок. Введите название для поиска.`
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
          isSearchable
          menuIsOpen={menuIsOpen}
          noOptionsMessage={() =>
            effectiveSearch.trim()
              ? 'Ничего не найдено. Добавьте иконку в allowlist топбара.'
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
            setSearch('')
          }}
          options={options}
          placeholder="Выберите иконку…"
          value={selectedOption}
        />
        {searchHint && (
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
