#!/usr/bin/env node
/** Cross-platform Playwright webServer: Docker + migrate + CMS + Web */
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const envExample = path.join(root, '.env.example')

const cmsUrl = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
const webUrl = process.env.WEB_URL ?? 'http://localhost:3000'

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: process.env })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

async function waitForUrl(url, timeoutMs = 120_000) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'follow' })
      if (response.ok) {
        return
      }
    } catch {
      // server not ready yet
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(`Timed out waiting for ${url}`)
}

if (!existsSync(envPath) && existsSync(envExample)) {
  copyFileSync(envExample, envPath)
}

run('docker', ['compose', 'up', '-d', '--wait', 'postgres', 'minio'])
run('docker', ['compose', 'up', '--no-deps', 'minio-init'])
run('pnpm', ['payload', 'migrate'])

const cms = spawn('pnpm', ['--filter', '@iva360/cms', 'dev'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
})

cms.on('error', (err) => {
  console.error(err.message)
  process.exit(1)
})

cms.on('close', (code) => {
  if (code !== 0 && code !== null) {
    process.exit(code)
  }
})

try {
  await waitForUrl(`${cmsUrl}/admin/login`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  cms.kill()
  process.exit(1)
}

const web = spawn('pnpm', ['--filter', '@iva360/web', 'dev'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
})

web.on('error', (err) => {
  console.error(err.message)
  cms.kill()
  process.exit(1)
})

web.on('close', (code) => {
  cms.kill()
  process.exit(code ?? 1)
})

try {
  await waitForUrl(webUrl)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  web.kill()
  cms.kill()
  process.exit(1)
}
