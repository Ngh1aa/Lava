import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.BASE_URL ?? "http://127.0.0.1:4173/";
const files = await fs.readdir("dist", { recursive: true });
const allRoutes = files
  .filter((file) => /(^|[\\/])index\.html$/.test(file))
  .map((file) => file.replaceAll("\\", "/").replace(/index\.html$/, ""));
const routeFilter = process.env.CAPTURE_ROUTES?.split(",").map((route) =>
  route.replace(/^\//, ""),
);
const routes = routeFilter
  ? allRoutes.filter((route) => routeFilter.includes(route))
  : allRoutes;
await fs.mkdir("qa/project-screenshots", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.CI ? undefined : "chrome",
  headless: true,
});
try {
  for (const width of process.env.CAPTURE_WIDTHS
    ? process.env.CAPTURE_WIDTHS.split(",").map(Number)
    : [375, 390, 768, 1280, 1440, 1920]) {
    const page = await browser.newPage({
      reducedMotion: "reduce",
      viewport: { width, height: width < 600 ? 844 : 1000 },
      isMobile: width < 600,
      hasTouch: width < 600,
    });
    await page.addInitScript(() => {
      localStorage.setItem(
        "lava.saved.v1",
        JSON.stringify(["gallery-lounge", "open-terrace"]),
      );
      sessionStorage.setItem(
        "lava.enquiry.v1",
        JSON.stringify({
          name: "Alex Morgan",
          email: "alex@example.com",
          interest: "A creative collaboration",
          message:
            "I would like to explore the gallery lounge and open terrace for a creative gathering. Please include the architectural concept in our conversation.",
          spaces: ["gallery-lounge", "open-terrace"],
        }),
      );
    });
    for (const route of routes) {
      await page.goto(new URL(`${route}?view=still`, base).href);
      await page.evaluate(async () => {
        await document.fonts.ready;
        Array.from(document.images).forEach((i) => (i.loading = "eager"));
        await Promise.all(
          Array.from(document.images).map((i) => i.decode().catch(() => {})),
        );
      });
      const name = route.replaceAll("/", "-") || "home";
      await page.screenshot({
        path: `qa/project-screenshots/${name}-${width}.png`,
        fullPage: true,
      });
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: `qa/project-screenshots/${name}-opening-${width}.png`,
        });
    }
    if ([390, 1440].includes(width)) {
      await page.goto(new URL("enquiry/", base).href);
      await page.locator("#name").fill("");
      await page.locator("#email").fill("");
      await page.locator("#message").fill("");
      await page.locator(".form-submit").click();
      await page.locator(".enquiry-panel").screenshot({
        path: `qa/project-screenshots/form-errors-${width}.png`,
      });
    }
    console.log(`Captured ${routes.length} routes at ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
