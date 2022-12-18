import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    publicDir: isProd ? false : 'public',
    build: {
      // target: 'esnext',
      // minify: false,
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
