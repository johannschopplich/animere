import { readFileSync } from 'fs'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH
const sourcemap = !production ? 'inline' : false
const { version, author, license } = JSON.parse(readFileSync('package.json'))

export const preamble = `/*!
 * Animere.js v${version}
 * Copyright (c) ${new Date().getFullYear()} ${author.name}
 * ${license} license
 */`

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/animere.min.js',
      format: 'es',
      sourcemap: sourcemap
    },
    {
      file: 'docs/js/animere.min.js',
      format: 'es',
      sourcemap: sourcemap
    }
  ],
  plugins: [
    production && terser({ output: { preamble } })
  ]
}
