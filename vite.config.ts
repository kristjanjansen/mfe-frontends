import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  const APP = env.APP;
  if (!APP) throw new Error("Missing APP=<appname>");

  const root = resolve(__dirname, "src/apps", APP);

  return {
    plugins: [tailwindcss()],
    envPrefix: ["MFE_", "VITE_"],
    envDir: __dirname,
    cacheDir: resolve(__dirname, "node_modules/.vite", APP),
    root,
    publicDir: resolve(__dirname, "public"),
    build: {
      outDir: resolve(__dirname, "dist", APP),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(root, "index.html"),
        output: {
          entryFileNames: "index.js",
          assetFileNames: "index.css",
        },
      },
    },
  };
});
