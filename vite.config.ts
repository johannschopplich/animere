import { resolve } from "path";
import { ConfigEnv, LibraryOptions, UserConfigExport } from "vite";

const libraryConfig: LibraryOptions = {
  entry: resolve(__dirname, "src/index.ts"),
  name: "Animere",
  formats: ["es", "umd", "iife"],
};

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const isLib = mode === "production";

  return {
    publicDir: isLib ? false : "public",
    build: {
      // target: 'esnext',
      // minify: false,
      lib: isLib ? libraryConfig : false,
    },
  };
};
