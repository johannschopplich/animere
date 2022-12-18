import { defineConfig, presetWind, transformerDirectives } from 'unocss'
import { presetDue } from 'duecss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: '#E57166',
        50: '#FFFFFF',
        100: '#FDF2F1',
        200: '#F7D2CF',
        300: '#F1B2AC',
        400: '#EB9189',
        500: '#E57166',
        600: '#DD4436',
        700: '#BB2D20',
        800: '#8B2218',
        900: '#5B160F',
      },
      accent: {
        DEFAULT: '#27282A',
        50: '#808389',
        100: '#76797F',
        200: '#626469',
        300: '#4E5054',
        400: '#3B3C3F',
        500: '#27282A',
        600: '#0C0C0D',
        700: '#000000',
        800: '#000000',
        900: '#000000',
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [presetWind(), presetDue()],
})
