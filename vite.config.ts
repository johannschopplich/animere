import { resolve } from "path";
import { ConfigEnv, UserConfigExport } from "vite";

export default ({ mode }: ConfigEnv): UserConfigExport => ({
  publicDir: mode === "docs" ? "public" : false,
  build: {
    // target: 'esnext',
    // minify: false,
    lib:
      mode === "docs"
        ? false
        : {
            entry: resolve(__dirname, "src/index.ts"),
            name: "Animere",
            formats: ["es", "umd", "iife"],
          },
  },
});
