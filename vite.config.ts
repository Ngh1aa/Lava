import { defineConfig } from "vite";
import { renderPage } from "./src/page.ts";

export default defineConfig({
  plugins: [
    {
      name: "lava-static-content",
      transformIndexHtml: (html) =>
        html.replace("<!--lava-content-->", renderPage()),
    },
  ],
  base: "./",
  build: { target: "es2022" },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
