import type { GlobalConfig } from 'payload'

/** Публичное чтение для фронтенда; изменение — только авторизованным редакторам. */
export const globalEditorAccess: GlobalConfig['access'] = {
  read: () => true,
  update: ({ req: { user } }) => Boolean(user),
}
