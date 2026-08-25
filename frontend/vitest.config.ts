import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/**/*.spec.ts', 'components/**/*.spec.ts', 'composables/**/*.spec.ts', 'tests/**/*.spec.ts'],
  },
})
