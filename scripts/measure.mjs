import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import desktop from "lighthouse/core/config/desktop-config.js";
import fs from "node:fs/promises";

await fs.mkdir("qa", { recursive: true });
const prefix = process.env.REPORT_PREFIX ?? "lighthouse";
const chrome = await chromeLauncher.launch({
  chromePath:
    process.env.CHROME_PATH ??
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  chromeFlags: ["--headless", "--disable-extensions"],
});
try {
  for (const mode of ["mobile", "desktop"]) {
    const result = await lighthouse(
      process.env.BASE_URL ?? "http://127.0.0.1:4173/",
      {
        port: chrome.port,
        output: ["json", "html"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      mode === "desktop" ? desktop : undefined,
    );
    if (!result) throw new Error("Lighthouse did not return a report");
    await fs.writeFile(`qa/${prefix}-${mode}.json`, result.report[0]);
    await fs.writeFile(`qa/${prefix}-${mode}.html`, result.report[1]);
    console.log(
      mode,
      JSON.stringify({
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            value.score,
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      }),
    );
  }
} finally {
  await chrome.kill();
}
