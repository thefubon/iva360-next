#!/usr/bin/env node
/**
 * Cross-platform script dispatcher: .sh on Unix, .ps1 on Windows.
 * Usage: node scripts/run.mjs <dev|push|test> [args...]
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const name = process.argv[2]
const args = process.argv.slice(3)

if (!name) {
  console.error('Usage: node scripts/run.mjs <dev|push|test> [args...]')
  process.exit(1)
}

const isWin = process.platform === 'win32'
const scriptPath = path.join(__dirname, isWin ? `${name}.ps1` : `${name}.sh`)

const winArgMap = {
  '--quick': '-Quick',
  '--no-docker': '-NoDocker',
  '--no-migrate': '-NoMigrate',
  '--help': '-Help',
  '-h': '-Help',
}
const mappedArgs = isWin ? args.map((a) => winArgMap[a] ?? a) : args

if (!existsSync(scriptPath)) {
  console.error(`Script not found: ${scriptPath}`)
  process.exit(1)
}

const child = isWin
  ? spawn(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, ...mappedArgs],
      { stdio: 'inherit' },
    )
  : spawn('bash', [scriptPath, ...mappedArgs], { stdio: 'inherit' })

child.on('error', (err) => {
  console.error(err.message)
  process.exit(1)
})

child.on('close', (code) => {
  process.exit(code ?? 1)
})
