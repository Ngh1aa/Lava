import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

// Export the licensed GLB adaptation with the same framing as each runtime scene.
// Run against Vite dev: BASE_URL=http://127.0.0.1:5173/ node scripts/render-assets.mjs
const base = process.env.BASE_URL ?? "http://127.0.0.1:5173/";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, reducedMotion: "reduce" });
  await page.goto(new URL("credits/", base).href);
  const exports = [
    { name: "hero", hero: true, width: 1600, height: 1000, view: 0 },
    { name: "hero-mobile", hero: true, width: 452, height: 510, view: 0 },
    ...["exterior", "facade-view", "structure"].flatMap((name, view) => [
      { name, hero: false, width: 1600, height: 1000, view },
      { name: `${name}-mobile`, hero: false, width: 390, height: 410, view },
    ]),
  ];
  for (const settings of exports) {
    const data = await page.evaluate(async ({ moduleUrl, settings }) => {
      const { createScene } = await import(moduleUrl);
      const host = document.createElement("div");
      Object.assign(host.style, { position: "fixed", top: "0", left: "0", width: `${settings.width}px`, height: `${settings.height}px` });
      document.body.append(host);
      let controller;
      try {
        return await new Promise((resolve, reject) => {
          controller = createScene(host, {
            hero: settings.hero,
            onReady() { resolve(host.querySelector("canvas").toDataURL("image/webp", 0.88).split(",")[1]); },
            onError() { reject(new Error(`Could not export ${settings.name}`)); },
          });
          controller.setView(settings.view);
        });
      } finally {
        controller?.destroy();
        host.remove();
      }
    }, { moduleUrl: new URL("src/scene.ts", base).href, settings });
    await fs.writeFile(`public/images/${settings.name}.webp`, Buffer.from(data, "base64"));
    console.log(`Rendered ${settings.name}.webp`);
  }
} finally {
  await browser.close();
}
