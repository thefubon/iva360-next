#!/usr/bin/env node
/** Print shell `export KEY="value"` lines for monorepo root `.env` (safe for eval). */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')

if (!fs.existsSync(envPath)) {
  process.exit(0)
}

const parsed = dotenv.parse(fs.readFileSync(envPath))

for (const [key, value] of Object.entries(parsed)) {
  if (value === undefined) continue
  process.stdout.write(`export ${key}=${JSON.stringify(value)}\n`)
}
