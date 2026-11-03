import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  // Software GPU shader compilation on the Linux runner needs a larger loading budget.
  // Assertions remain identical; this does not add delays or retries to application code.
  timeout: process.env.CI ? 60000 : 30000,
  expect: { timeout: process.env.CI ? 15000 : 5000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: process.env.CI ? undefined : "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
