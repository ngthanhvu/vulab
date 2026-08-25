import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, 'app'),
    },
  },
  test: {
    environment: 'node',
    include: ['app/**/*.spec.ts', 'components/**/*.spec.ts', 'composables/**/*.spec.ts', 'tests/**/*.spec.ts'],
  },
})
