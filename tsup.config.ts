import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  sourcemap: false,
  minify: false,
  clean: true,
  bundle: true,
  splitting: true,
  platform: 'browser',
  shims: true,
  noExternal:['nearley'],
})
