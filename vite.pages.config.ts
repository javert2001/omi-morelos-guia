import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const output = fileURLToPath(new URL("./dist-pages/", import.meta.url));
const requestedBase = process.env.PAGES_BASE_PATH?.trim() || "/";
const base = `/${requestedBase.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");

export default defineConfig({
  base,
  resolve: { alias: { "@": projectRoot } },
  plugins: [
    react(),
    {
      name: "omi-pages-entry-points",
      apply: "build",
      async writeBundle() {
        // Hash routes always load this same application. Keep /dashboard/ links
        // from the local preview valid and let Pages recover other deep links.
        await mkdir(`${output}dashboard`, { recursive: true });
        await Promise.all([
          copyFile(`${output}index.html`, `${output}404.html`),
          copyFile(`${output}index.html`, `${output}dashboard/index.html`),
          writeFile(`${output}.nojekyll`, ""),
        ]);
      },
    },
  ],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
  preview: { host: "127.0.0.1", port: 4173 },
});
