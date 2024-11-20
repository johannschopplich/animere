import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    publicDir: isProd ? false : 'public',
    build: {
      lib: isProd && {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Animere',
        formats: ['es', 'umd', 'iife'],
      },
    },
    plugins: [
      !isProd && UnoCSS(),
    ],
  }
})
