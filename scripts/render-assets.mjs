import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

// Capture original Three.js geometry into optimized, reproducible fallback/gallery assets.
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1100 },
    reducedMotion: "reduce",
  });
  await page.goto(process.env.BASE_URL ?? "http://127.0.0.1:5173/");
  await page.locator("#architecture").scrollIntoViewIfNeeded();
  await page.locator('#architecture-scene[data-render="webgl"]').waitFor();
  await page.locator("#showcase").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    document
      .querySelectorAll(".showcase-tools,.showcase-caption")
      .forEach((el) => {
        el.style.visibility = "hidden";
      });
  });
  for (const [index, name] of [
    [0, "exterior"],
    [2, "structure"],
  ]) {
    await page.locator("[data-view]").nth(index).click();
    await page.locator("#showcase").scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const buffer = await page
      .locator("#architecture-scene canvas")
      .screenshot();
    const data = await page.evaluate(async (source) => {
      const image = new Image();
      image.src = `data:image/png;base64,${source}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas.toDataURL("image/webp", 0.88).split(",")[1];
    }, buffer.toString("base64"));
    await fs.writeFile(
      `public/images/${name}.webp`,
      Buffer.from(data, "base64"),
    );
    console.log(`Rendered ${name}.webp`);
  }
} finally {
  await browser.close();
}
