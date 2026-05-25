import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

let loaded = false

/** Load monorepo root `.env` once (apps live under `apps/*`). */
export function loadRootEnv(): void {
  if (loaded) return

  const here = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(here, '../../..')
  loadEnv({ path: path.join(root, '.env') })
  loaded = true
}
