import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH
const sourcemap = !production ? 'inline' : false

export default {
  input: 'index.js',
  output: {
    file: 'dist/animere.min.js',
    format: 'es',
    sourcemap: sourcemap
  },
  plugins: [
    production && terser()
  ]
}
