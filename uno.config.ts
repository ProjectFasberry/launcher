import { defineConfig, presetAttributify, presetWind4, transformerDirectives } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetScrollbar(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})