import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Node environment is enough: tests cover pure logic and source/asset
    // assertions, not DOM behavior.
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    // Keep the suite green before any test files exist (first infra commit).
    passWithNoTests: true,
  },
});
