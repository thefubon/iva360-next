import { Extension, InputRule } from '@tiptap/core'

/** Converts typed `&nbsp;` into a real non-breaking space character. */
export const NbspInputRule = Extension.create({
  name: 'nbspInputRule',

  addInputRules() {
    return [
      new InputRule({
        find: /&nbsp;$/,
        handler: ({ state, range }) => {
          const { tr } = state
          tr.insertText('\u00A0', range.from, range.to)
        },
      }),
    ]
  },
})
