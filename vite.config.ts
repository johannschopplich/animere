import { resolve } from "path";
import type { ConfigEnv, UserConfigExport } from "vite";

export default ({ mode }: ConfigEnv): UserConfigExport => {
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
  };
};
