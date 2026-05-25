import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.int.spec.ts'],
    // Payload + Postgres init can exceed 10s when the pre-push gate runs jobs in parallel.
    hookTimeout: 60_000,
    testTimeout: 30_000,
  },
})
