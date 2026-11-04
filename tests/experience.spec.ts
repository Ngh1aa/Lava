import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("all required viewport widths reflow, load assets and expose the hero CTA", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  for (const width of [320, 375, 390, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.goto("/");
    await expect(page.locator("#hero-scene")).toHaveAttribute(
      "data-render",
      /webgl|fallback/,
    );
    await expect(
      page.getByRole("link", { name: "Explore LAVA" }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `horizontal overflow at ${width}`,
    ).toBe(true);
    await page.locator(".home-spaces").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("link", { name: "Explore all spaces" }),
    ).toBeVisible();
    const badImages = await page
      .locator("main img")
      .evaluateAll((images) =>
        images
          .filter(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth === 0,
          )
          .map((img) => img.getAttribute("src")),
      );
    expect(badImages).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("mobile navigation, Escape and anchor focus work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  await toggle.click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Architecture" })
    .click();
  await expect(page.locator("#mobile-menu")).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Form follows",
  );
  await expect(page).toHaveURL(/\/architecture\/$/);
});

test("real WebGL viewer responds to camera, lighting, power and keyboard tabs", async ({
  page,
}) => {
  // Assert camera/render differences in the stable supported mode, including on software GPUs in CI.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/architecture/");
  await page.locator("#showcase").scrollIntoViewIfNeeded();
  await expect(page.locator("#architecture-scene")).toHaveAttribute(
    "data-render",
    "webgl",
  );
  const canvas = page.locator("#architecture-scene canvas");
  await page.waitForTimeout(700);
  const before = await canvas.screenshot();
  await page.getByRole("tab", { name: "The facade" }).click();
  await expect(
    page.getByRole("heading", { name: "A frame for the light." }),
  ).toBeVisible();
  await page.waitForTimeout(700);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.getByRole("button", { name: "Daylight", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Daylight", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Reduce detail", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reduce detail", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("tab", { name: "The facade" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "The structure" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "The arrival" })).toBeFocused();
  await page.getByRole("button", { name: "Rotate building right" }).click();
});

test("gallery opens the correct image, supports keys and restores focus", async ({
  page,
}) => {
  await page.goto("/gallery/");
  const opener = page.getByRole("link", { name: "Open A warm welcome" });
  await opener.click();
  await expect(
    page.getByRole("dialog", { name: "A warm welcome" }),
  ).toBeVisible();
  await expect(page.locator("#lightbox-image")).toHaveAttribute(
    "src",
    /lounge.webp$/,
  );
  await expect(page.locator("#lightbox-credit")).toHaveText(
    "Photo: Sébastien Lavalaye",
  );
  await expect(page.locator("#lightbox-credit")).toHaveAttribute(
    "href",
    /unsplash.com\/photos\/.+kXKQEhfd06o$/,
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#lightbox-title")).toHaveText(
    "Between earth and sky",
  );
  await expect(page.locator("#lightbox-credit")).toHaveText(
    "Photo: Caio Arbulu",
  );
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.goto("/spaces/gallery-lounge/");
  await page.getByRole("link", { name: "Open A warm welcome" }).click();
  await expect(page.locator("#lightbox-title")).toHaveText("A warm welcome");
});

test("enquiry validates, retains input, downloads exact details and never claims delivery", async ({
  page,
}) => {
  await page.goto("/enquiry/?space=gallery-lounge");
  await page.locator(".form-submit").click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#email-error")).toHaveText(
    "Please enter your email address.",
  );
  await page.getByLabel("Your name", { exact: true }).fill("LAVA QA");
  await page.getByLabel("Email address", { exact: true }).fill("invalid");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("A conversation about the architecture.");
  await page.locator(".form-submit").click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#name")).toHaveValue("LAVA QA");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("qa@example.com");
  const requestUrls: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") requestUrls.push(r.url());
  });
  await page.locator(".form-submit").click();
  await expect(page).toHaveURL(/\/enquiry\/review\/$/);
  await expect(page.locator("[data-review-details]")).toContainText(
    "The gallery lounge",
  );
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page).toHaveURL(/\/enquiry\/ready\/$/);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("LAVA-enquiry.txt");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString();
  expect(text).toContain("LAVA QA");
  expect(text).toContain("qa@example.com");
  expect(text).toContain("A conversation about the architecture.");
  await expect(page.locator("[data-enquiry-status]")).toContainText(
    "It has not been sent",
  );
  expect(requestUrls).toEqual([]);
});

test("reduced motion, unavailable WebGL and context loss retain the experience", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?view=still");
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "fallback",
  );
  await expect(page.locator("html")).not.toHaveClass(/js-motion/);
  await expect(page.locator(".scene-fallback").first()).toBeVisible();
  await page.goto("/architecture/?view=still");
  await page.locator("#showcase").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Daylight", exact: true }),
  ).toBeDisabled();
  await page.getByRole("tab", { name: "The structure" }).click();
  await expect(
    page.getByRole("heading", { name: "Clarity in every line." }),
  ).toBeVisible();
  await page.goto("/");
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "webgl",
  );
  await page
    .locator("#hero-scene canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "fallback",
  );
});

test("WebGL constructor failure falls back without a runtime exception", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof getContext>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/");
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "fallback",
  );
  await expect(page.getByRole("link", { name: "Explore LAVA" })).toBeVisible();
});

test("axe WCAG AA on desktop, mobile menu, form errors and gallery", async ({
  page,
}) => {
  // Audit stable supported states; intermediate fade frames are tested separately as motion.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const audit = async () =>
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  await audit();
  await page.goto("/enquiry/");
  await page.locator(".form-submit").click();
  await audit();
  await page.goto("/gallery/");
  await page.getByRole("link", { name: "Open The blue hour" }).click();
  await audit();
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await audit();
});

test("touch devices load 3D on request and gallery accepts a swipe", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "still",
  );
  await expect(page.locator("#hero-scene canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "View in 3D", exact: true }).click();
  await expect(page.locator("#hero-scene")).toHaveAttribute(
    "data-render",
    "webgl",
  );
  await page
    .getByRole("button", { name: "Still view", exact: true })
    .first()
    .click();
  await expect(page.locator("#hero-scene canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "View in 3D", exact: true }),
  ).toBeFocused();
  await page.goto("http://127.0.0.1:4173/architecture/");
  await page.locator("#showcase").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Daylight", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Explore in 3D", exact: true })
    .click();
  await expect(page.locator("#architecture-scene")).toHaveAttribute(
    "data-render",
    "webgl",
  );
  await expect(
    page.getByRole("button", { name: "Daylight", exact: true }),
  ).toBeEnabled();
  await page.goto("http://127.0.0.1:4173/gallery/");
  await page.getByRole("link", { name: "Open The blue hour" }).click();
  const cdp = await context.newCDPSession(page);
  const bounds = await page.locator(".lightbox-stage").boundingBox();
  if (!bounds) throw new Error("Gallery stage is missing");
  const y = bounds.y + bounds.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 300, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 100, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("#lightbox-title")).toHaveText("A warm welcome");
  await context.close();
});

test("without JavaScript the narrative and image links work, enquiry cannot leak via GET", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(
    page.getByRole("heading", { name: "A different perspective." }),
  ).toBeVisible();
  await page.goto("http://127.0.0.1:4173/enquiry/");
  await expect(page.locator(".form-submit")).toBeDisabled();
  await page.goto("http://127.0.0.1:4173/gallery/");
  await page.getByRole("link", { name: "Open The blue hour" }).click();
  await expect(page).toHaveURL(/arrival.webp$/);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A collection",
  );
  await context.close();
});

test("short viewports keep the hero CTA visible and large wordmark clear of the headline", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [375, 667],
    [390, 740],
    [1280, 720],
    [1920, 1000],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Explore LAVA" }),
    ).toBeInViewport();
    if (width >= 1200) {
      const wordmark = await page.locator(".hero-wordmark").boundingBox();
      const title = await page.locator("#hero-title").boundingBox();
      expect(
        wordmark && title && wordmark.y + wordmark.height <= title.y,
        `wordmark overlaps headline at ${width}x${height}`,
      ).toBe(true);
    }
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
  }
});
