'use client'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  fieldBaseClass,
  useField,
  withCondition,
} from '@payloadcms/ui'
import { NbspInputRule } from '@/lib/tiptap/nbsp-input-rule'
import type { TextFieldClientComponent } from 'payload'
import { useCallback, useEffect } from 'react'

const EMPTY_HTML = '<p></p>'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Wrap legacy plain-text values so TipTap can edit them. */
export function normalizeTiptapContent(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
  }

  return `<p>${escapeHtml(trimmed)}</p>`
}

function normalizeStoredHtml(html: string): string {
  const trimmed = html.trim()
  if (!trimmed || trimmed === EMPTY_HTML || trimmed === '<p><br></p>' || trimmed === '<p><br/></p>') {
    return ''
  }

  return trimmed
}

const TiptapFieldComponent: TextFieldClientComponent = (props) => {
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

  const editor = useEditor({
    content: normalizeTiptapContent(value),
    editable: !disabled && !readOnly,
    extensions: [Document, Paragraph, Text, Bold, NbspInputRule],
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setValue(normalizeStoredHtml(currentEditor.getHTML()))
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(!disabled && !readOnly)
  }, [disabled, editor, readOnly])

  useEffect(() => {
    if (!editor) {
      return
    }

    const nextContent = normalizeTiptapContent(value)
    const currentContent = editor.getHTML()

    if (currentContent !== nextContent && normalizeStoredHtml(currentContent) !== normalizeStoredHtml(nextContent)) {
      editor.commands.setContent(nextContent || EMPTY_HTML, { emitUpdate: false })
    }
  }, [editor, value])

  const isBoldActive = editor?.isActive('bold') ?? false
  const isInteractionDisabled = disabled || readOnly || !editor

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
        <div className="tiptap-field">
          <div className="tiptap-field__toolbar">
            <button
              aria-label="Жирный"
              aria-pressed={isBoldActive}
              className="tiptap-field__toolbar-button"
              data-active={isBoldActive ? 'true' : undefined}
              disabled={isInteractionDisabled}
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => {
                editor?.chain().focus().toggleBold().run()
              }}
              title="Жирный (Ctrl+B)"
              type="button"
            >
              B
            </button>
          </div>
          <div className="tiptap-field__editor">
            <EditorContent editor={editor} />
          </div>
        </div>
        <RenderCustomComponent CustomComponent={AfterInput} Fallback={null} />
      </div>
      <style>{`
        .tiptap-field {
          width: 100%;
        }

        .tiptap-field__toolbar,
        .tiptap-field__editor {
          border: 1px solid var(--theme-border-color, var(--theme-elevation-150));
          transition: border-color 100ms, box-shadow 100ms, background-color 500ms;
        }

        .tiptap-field__toolbar {
          align-items: center;
          background: var(--theme-input-bg);
          border-bottom: none;
          border-radius: var(--style-radius-s) var(--style-radius-s) 0 0;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 0.35rem;
          padding: 0.35rem;
        }

        .tiptap-field__editor {
          background: var(--theme-input-bg);
          border-radius: 0 0 var(--style-radius-s) var(--style-radius-s);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .tiptap-field:not(:has(.tiptap-field__toolbar-button:disabled)):hover .tiptap-field__toolbar,
        .tiptap-field:not(:has(.tiptap-field__toolbar-button:disabled)):hover .tiptap-field__editor {
          border-color: var(--theme-elevation-250);
        }

        .tiptap-field:focus-within .tiptap-field__toolbar,
        .tiptap-field:focus-within .tiptap-field__editor {
          border-color: var(--theme-elevation-400);
          outline: 0;
        }

        .tiptap-field__editor .tiptap.ProseMirror {
          background: transparent;
          border: none;
          box-shadow: none;
          color: var(--theme-elevation-800);
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.5;
          min-height: 7rem;
          outline: none;
          padding: 0.65rem 0.75rem;
        }

        .tiptap-field__editor .tiptap.ProseMirror:focus,
        .tiptap-field__editor .tiptap.ProseMirror:focus-visible {
          outline: none;
        }

        .tiptap-field__editor .tiptap.ProseMirror p {
          margin: 0;
        }

        .tiptap-field__toolbar-button {
          background: transparent;
          border: 1px solid var(--theme-border-color, var(--theme-elevation-150));
          border-radius: var(--style-radius-s);
          color: var(--theme-elevation-800);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 700;
          line-height: 1;
          min-width: 2rem;
          padding: 0.35rem 0.55rem;
        }

        .tiptap-field__toolbar-button[data-active='true'] {
          background: var(--theme-elevation-150);
        }

        .tiptap-field__toolbar-button:hover:not(:disabled) {
          border-color: var(--theme-elevation-250);
        }

        .tiptap-field__toolbar-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .field-type.read-only .tiptap-field__editor,
        .field-type.read-only .tiptap-field__toolbar {
          background: var(--theme-elevation-100);
          box-shadow: none;
        }

        .field-type.read-only .tiptap-field__editor .tiptap.ProseMirror {
          color: var(--theme-elevation-400);
        }

        html[data-theme='light'] .field-type.error .tiptap-field__editor,
        html[data-theme='light'] .field-type.error .tiptap-field__toolbar {
          background-color: var(--theme-error-50);
          border-color: var(--theme-error-500);
        }

        html[data-theme='dark'] .field-type.error .tiptap-field__editor,
        html[data-theme='dark'] .field-type.error .tiptap-field__toolbar {
          background-color: var(--theme-error-100);
          border-color: var(--theme-error-400);
        }
      `}</style>
    </div>
  )
}

export const TiptapField = withCondition(TiptapFieldComponent)
