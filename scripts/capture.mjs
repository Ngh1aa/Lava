import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.BASE_URL ?? "http://127.0.0.1:4173/";
await fs.mkdir("qa/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [375, 390, 768, 1280, 1440, 1920]) {
    const page = await browser.newPage({
      reducedMotion: "reduce",
      viewport: { width, height: width < 600 ? 844 : 1000 },
      isMobile: width < 600,
      hasTouch: width < 600,
    });
    await page.goto(base);
    await page.locator("#hero-scene[data-render]").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `qa/screenshots/hero-${width}.png` });
    if (await page.locator('[data-activate="hero"]').isVisible()) {
      await page.locator('[data-activate="hero"]').click();
      await page.locator('#hero-scene[data-render="webgl"]').waitFor();
      await page.screenshot({ path: `qa/screenshots/hero-3d-${width}.png` });
    }
    // Activate each lazy image and 3D scene before the complete page capture.
    for (const id of [
      "vision",
      "architecture",
      "spaces",
      "experience",
      "gallery",
      "enquiry",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      if (id === "architecture") {
        await page.locator("#showcase").scrollIntoViewIfNeeded();
        await page.locator("#architecture-scene[data-render]").waitFor();
        if (await page.locator('[data-activate="viewer"]').isVisible()) {
          await page.locator('[data-activate="viewer"]').click();
          await page
            .locator('#architecture-scene[data-render="webgl"]')
            .waitFor();
        }
      }
      await page.waitForTimeout(100);
    }
    await page.locator("#architecture-scene[data-render]").waitFor();
    await page.evaluate(() => {
      [...document.images].forEach((image) => {
        image.loading = "eager";
      });
      return Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      );
    });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `qa/screenshots/full-${width}.png`,
      fullPage: true,
    });
    if ([390, 1440].includes(width)) {
      for (const id of [
        "vision",
        "showcase",
        "spaces",
        "experience",
        "gallery",
        "enquiry",
      ]) {
        const element = page.locator(`#${id}`);
        await element.scrollIntoViewIfNeeded();
        await element.screenshot({ path: `qa/screenshots/${id}-${width}.png` });
      }
      await page.goto(`${base}?direction=b`);
      await page.locator("#hero-scene[data-render]").waitFor();
      await page.screenshot({
        path: `qa/screenshots/direction-b-${width}.png`,
      });
      await page.goto(`${base}?view=still`);
      await page.locator('#hero-scene[data-render="fallback"]').waitFor();
      await page.screenshot({ path: `qa/screenshots/fallback-${width}.png` });
    }
    console.log(`Captured ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
