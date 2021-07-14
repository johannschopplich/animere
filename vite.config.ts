import { resolve } from "path";
import { ConfigEnv, LibraryOptions, UserConfigExport } from "vite";

const libraryConfig: LibraryOptions = {
  entry: resolve(__dirname, "src/index.ts"),
  name: "Animere",
  formats: ["es", "umd", "iife"],
};

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const isProd = mode === "production";

  return {
    publicDir: isProd ? false : "public",
    build: {
      // target: 'esnext',
      // minify: false,
      lib: isProd ? libraryConfig : false,
    },
  };
};
