import { resolve } from "path";
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    publicDir: isProd ? false : "public",
    build: {
      // target: 'esnext',
      // minify: false,
      lib: isProd && {
        entry: resolve(__dirname, "src/index.ts"),
        name: "Animere",
        formats: ["es", "umd", "iife"],
      },
    },
    plugins: [
      UnoCSS({
        transformers: [transformerDirective()],
      }),
    ],
  };
});
