import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { renderPage, routes, pageTitle, pageDescription } from "./src/page.ts";

// Normal pages use relative URLs. Error documents need the hosting mount path,
// because a missing URL can have arbitrary depth (for example /spaces/missing/).
const errorBase = process.env.LAVA_SITE_BASE ?? "/";
if (!/^\/(?:[\w-]+\/)*$/.test(errorBase))
  throw new Error("LAVA_SITE_BASE must be a path such as / or /Lava/");

export default defineConfig({
  plugins: [
    {
      name: "lava-static-content",
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          const address = new URL(request.url ?? "/", "http://localhost");
          const path = address.pathname;
          if (routes.includes(`${path}/`)) {
            response.writeHead(308, { Location: `${path}/${address.search}` });
            response.end();
          } else if (!routes.includes(path) && !/\.[^/]+$/.test(path)) {
            response.writeHead(404, {
              "Content-Type": "text/html; charset=utf-8",
            });
            response.end(
              readFileSync(new URL("./dist/404.html", import.meta.url), "utf8"),
            );
          } else next();
        });
      },
      transformIndexHtml: (html, context) => {
        const path = context.server
          ? new URL(
              context.originalUrl ?? context.path,
              "http://localhost",
            ).pathname.replace(/index\.html$/, "")
          : "/";
        const route = path.endsWith("/") ? path : `${path}/`;
        return html
          .replace("<!--lava-content-->", renderPage(route))
          .replace(/<title>.*?<\/title>/, `<title>${pageTitle(route)}</title>`)
          .replace(
            /(<meta\s+name="description"\s+content=")[^"]*/,
            `$1${pageDescription(route)}`,
          )
          .replace('<html lang="en">', '<html lang="en" data-root="/">');
      },
      generateBundle: {
        order: "post",
        handler(_options, bundle) {
          const entry = bundle["index.html"];
          if (!entry || entry.type !== "asset")
            throw new Error("Missing compiled HTML shell");
          const shell = String(entry.source);
          const render = (path: string, prefix: string) =>
            shell
              .replace(
                /<body>[\s\S]*<\/body>/,
                `<body>${renderPage(path)}</body>`,
              )
              .replace(
                /<title>.*?<\/title>/,
                `<title>${pageTitle(path)}</title>`,
              )
              .replace(
                /(<meta\s+name="description"\s+content=")[^"]*/,
                `$1${pageDescription(path)}`,
              )
              .replace('data-root="/"', `data-root="${prefix}"`)
              .replace(
                /srcset="([^"]+)"/g,
                (_match, sources: string) =>
                  `srcset="${sources.replaceAll("/images/", `${prefix}images/`)}"`,
              )
              .replace(
                /(href|src|action)="(?:\.\/|\/)(?!\/)/g,
                `$1="${prefix}`,
              );
          entry.source = render("/", "./");
          for (const route of routes.filter((path) => path !== "/")) {
            const depth = route.split("/").filter(Boolean).length;
            this.emitFile({
              type: "asset",
              fileName: `${route.slice(1)}index.html`,
              source: render(route, "../".repeat(depth)),
            });
          }
          this.emitFile({
            type: "asset",
            fileName: "404.html",
            source: render("/404/", errorBase),
          });
        },
      },
    },
  ],
  base: "./",
  build: { target: "es2022" },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
