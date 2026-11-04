import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

test("the still hero keeps its backdrop transparent for the brand composition", async ({
  page,
}) => {
  await page.goto("/?view=still");
  const alpha = await page
    .locator("#hero-scene img")
    .evaluate(async (img: HTMLImageElement) => {
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, 1, 1).data[3];
    });
  expect(alpha).toBe(0);
});

test("save feedback stays clear of shortlist actions on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/spaces/gallery-lounge/");
  await page
    .getByRole("button", {
      name: "Save space: The gallery lounge",
      exact: true,
    })
    .click();
  await page.getByRole("link", { name: /^Saved \d+ spaces$/ }).click();
  await page
    .getByRole("button", {
      name: "Remove The gallery lounge from saved spaces",
    })
    .click();
  const feedback = await page
    .locator("[data-save-feedback]:visible")
    .boundingBox();
  expect(feedback).not.toBeNull();
  for (const action of await page
    .locator("main a:visible, main button:visible")
    .all()) {
    if (
      await action.evaluate((el) => Boolean(el.closest("[data-save-feedback]")))
    )
      continue;
    const r = await action.boundingBox();
    if (!r || !feedback) continue;
    const overlap =
      Math.min(r.x + r.width, feedback.x + feedback.width) >
        Math.max(r.x, feedback.x) &&
      Math.min(r.y + r.height, feedback.y + feedback.height) >
        Math.max(r.y, feedback.y);
    expect(overlap, `feedback covers ${await action.innerText()}`).toBe(false);
  }
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator("[data-shortlist-count]")).toHaveText(
    "1 saved space",
  );
});

test("removing an enquiry space survives refresh and clearing a draft survives history Back", async ({
  page,
}) => {
  await page.goto("/enquiry/?space=gallery-lounge");
  await page
    .getByRole("button", { name: "Remove The gallery lounge from enquiry" })
    .click();
  await page.reload();
  await expect(page.locator("[data-selected-spaces]")).toContainText(
    "0 selected spaces",
  );
  await page.getByLabel("Your name", { exact: true }).fill("Privacy check");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("privacy@example.com");
  await page
    .getByLabel("Your message", { exact: true })
    .fill(
      "Checking that a cleared draft cannot return through browser history.",
    );
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await page.getByRole("button", { name: "Clear my draft" }).click();
  await page.getByRole("button", { name: "Clear draft", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await page.goBack();
  await expect(page.locator("[data-draft-missing]")).toBeVisible();
});

test("gallery filters keep lightbox navigation inside the selected collection", async ({
  page,
}) => {
  await page.goto("/gallery/");
  await page.getByRole("button", { name: "Facade", exact: true }).click();
  await expect(page.locator("[data-photo-category]:visible")).toHaveCount(1);
  const opener = page.getByRole("link", { name: "Open A study of form" });
  await opener.click();
  await expect(page.locator("#lightbox-count")).toHaveText("01 / 01");
  await expect(page.getByRole("button", { name: "Next image" })).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#lightbox-title")).toHaveText("A study of form");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator("[data-photo-category]:visible")).toHaveCount(6);
});

test("bookmarks from the original page open the corresponding project pages", async ({
  page,
}) => {
  for (const [hash, route] of [
    ["architecture", "architecture"],
    ["spaces", "spaces"],
    ["gallery", "gallery"],
    ["enquiry", "enquiry"],
    ["experience", "experience"],
    ["overview", "project"],
  ]) {
    await page.goto(`/#${hash}`);
    await expect(page).toHaveURL(new RegExp(`/${route}/$`));
  }
});

test("nested static deployment loads assets, navigation, saved state and enquiry review", async ({
  browser,
}) => {
  const folder = resolve("dist");
  const server = createServer(async (request, response) => {
    const path = new URL(request.url ?? "/", "http://localhost").pathname;
    if (!path.startsWith("/Lava/")) {
      response.writeHead(404).end();
      return;
    }
    const file = resolve(
      folder,
      decodeURIComponent(path.slice(6)),
      path.endsWith("/") ? "index.html" : "",
    );
    if (!file.startsWith(folder + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const mime: Record<string, string> = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
      };
      response
        .writeHead(200, {
          "Content-Type": mime[extname(file)] ?? "application/octet-stream",
        })
        .end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("No static server address");
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.url());
  });
  try {
    await page.goto(
      `http://127.0.0.1:${address.port}/Lava/spaces/gallery-lounge/`,
    );
    await page
      .locator(".detail-cover img")
      .evaluate((img: HTMLImageElement) => img.decode());
    await page
      .getByRole("button", {
        name: "Save space: The gallery lounge",
        exact: true,
      })
      .click();
    await page.getByRole("link", { name: "Enquire about space" }).click();
    await expect(page).toHaveURL(/\/Lava\/enquiry\/$/);
    await page.getByLabel("Your name", { exact: true }).fill("Static hosting");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("static@example.com");
    await page
      .getByLabel("Your message", { exact: true })
      .fill("An enquiry from a nested static deployment.");
    await page.getByRole("button", { name: "Review your enquiry" }).click();
    await expect(page).toHaveURL(/\/Lava\/enquiry\/review\/$/);
    await expect(page.locator("[data-review-details]")).toContainText(
      "The gallery lounge",
    );
    await page.getByRole("link", { name: /^Saved \d+ spaces$/ }).click();
    await expect(page.locator("[data-shortlist-count]")).toHaveText(
      "1 saved space",
    );
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await new Promise<void>((done) => server.close(() => done()));
  }
});

const routes = [
  "/",
  "/project/",
  "/architecture/",
  "/spaces/",
  "/spaces/workplace/",
  "/spaces/gallery-lounge/",
  "/spaces/meeting-suite/",
  "/spaces/open-terrace/",
  "/experience/",
  "/gallery/",
  "/saved/",
  "/enquiry/",
  "/enquiry/review/",
  "/enquiry/ready/",
  "/contact/",
  "/credits/",
  "/privacy/",
];
for (const width of [320, 375, 390, 768, 1280, 1440, 1920]) {
  test(`all 17 routes render and reflow at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    for (const route of routes) {
      const response = await page.goto(`${route}?view=still`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflows at ${width}`,
      ).toBe(true);
      const broken = await page
        .locator("main img")
        .evaluateAll((images) =>
          images
            .filter(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                !img.naturalWidth,
            )
            .map((img) => img.getAttribute("src")),
        );
      expect(broken).toEqual([]);
      const clipping = await page
        .locator("h1,h2,p,.solid-button")
        .evaluateAll((elements) =>
          elements
            .filter(
              (e) =>
                !e.closest("[hidden],.sr-only") &&
                e.clientWidth > 0 &&
                e.scrollWidth > e.clientWidth + 2,
            )
            .map((e) => e.textContent),
        );
      expect(clipping, `${route} clipped text at ${width}`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("space filters survive Back and the detail breadcrumb; empty results recover", async ({
  page,
}) => {
  await page.goto("/spaces/");
  await page.getByRole("radio", { name: "Meet", exact: true }).check();
  await expect(page.locator("[data-space]:visible")).toHaveCount(2);
  await expect(page).toHaveURL(/use=Meet/);
  await page.getByLabel("Filter by level").selectOption("06");
  await expect(page.locator("[data-filter-empty]")).toBeVisible();
  await page.goBack();
  await expect(page.locator("[data-space]:visible")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Explore The gallery lounge", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Where ideas",
  );
  await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Spaces", exact: true })
    .click();
  await expect(
    page.getByRole("radio", { name: "Meet", exact: true }),
  ).toBeChecked();
  await page.getByLabel("Filter by level").selectOption("06");
  await page.getByRole("button", { name: "Show all spaces" }).click();
  await expect(page.locator("[data-space]:visible")).toHaveCount(4);
  await expect(
    page.getByRole("radio", { name: "All", exact: true }),
  ).toBeFocused();
});

test("saved spaces persist, remove, undo, and clear to a useful empty state", async ({
  page,
}) => {
  await page.goto("/spaces/");
  await page
    .getByRole("button", {
      name: "Save space: The gallery lounge",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Save space: The open terrace", exact: true })
    .click();
  await page
    .getByRole("link", { name: /^Saved \d+ spaces$/, exact: true })
    .click();
  await expect(
    page.locator("[data-shortlist-grid] [data-space]:visible"),
  ).toHaveCount(2);
  await page.reload();
  await expect(page.locator("[data-shortlist-count]")).toHaveText(
    "2 saved spaces",
  );
  await page
    .getByRole("button", {
      name: "Remove The gallery lounge from saved spaces",
    })
    .click();
  await expect(page.locator("[data-shortlist-count]")).toHaveText(
    "1 saved space",
  );
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator("[data-shortlist-count]")).toHaveText(
    "2 saved spaces",
  );
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect(page.locator("[data-saved-empty]")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore the spaces", exact: true }),
  ).toBeFocused();
  await expect(
    page.locator("[data-shortlist-grid] [data-space]:visible"),
  ).toHaveCount(0);
});

test("a complete shortlist enquiry retains identity through edit, refresh and download", async ({
  page,
}) => {
  const mutations: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") mutations.push(r.url());
  });
  await page.goto("/spaces/open-terrace/");
  await page
    .getByRole("button", { name: "Save space: The open terrace", exact: true })
    .click();
  await page
    .getByRole("link", { name: /^Saved \d+ spaces$/, exact: true })
    .click();
  await page.getByRole("link", { name: "Enquire with selection" }).click();
  await expect(page.locator("[data-selected-spaces]")).toContainText(
    "The open terrace",
  );
  await page.getByLabel("Your name", { exact: true }).fill("Alex <Studio>");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("alex@example.com");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("I would like to discuss the rooftop concept.");
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await page.getByRole("link", { name: "Edit details" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Alex <Studio>",
  );
  await page
    .getByLabel("Your message", { exact: true })
    .fill("A revised brief for an open-air gathering.");
  await page.reload();
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "A revised brief for an open-air gathering.",
  );
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page.locator("[data-review-details]")).toContainText(
    "Alex <Studio>",
  );
  await expect(page.locator("[data-review-details] studio")).toHaveCount(0);
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry" }).click();
  const file = await downloaded;
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString();
  expect(body).toContain("The open terrace");
  expect(body).toContain("A revised brief for an open-air gathering.");
  expect(body).not.toContain("The gallery lounge");
  expect(mutations).toEqual([]);
  await page.getByRole("button", { name: "Clear my draft" }).click();
  await page.getByRole("button", { name: "Keep draft", exact: true }).click();
  await expect(page.locator("[data-draft-ready]")).toBeVisible();
  await page.getByRole("button", { name: "Clear my draft" }).click();
  await page.getByRole("button", { name: "Clear draft", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await page.goto("/enquiry/review/");
  await expect(page.locator("[data-draft-missing]")).toBeVisible();
});

test("every space has the correct identity and an original downloadable plan", async ({
  page,
}) => {
  for (const [id, title] of [
    ["workplace", "The open workplace"],
    ["gallery-lounge", "The gallery lounge"],
    ["meeting-suite", "The meeting suite"],
    ["open-terrace", "The open terrace"],
  ]) {
    await page.goto(`/spaces/${id}/`);
    await expect(page.locator(".plan-drawing svg")).toHaveAccessibleName(
      new RegExp(title),
    );
    const downloaded = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download concept plan" }).click();
    const file = await downloaded;
    expect(file.suggestedFilename()).toBe(`LAVA-${id}-concept.svg`);
    await page.getByRole("link", { name: "Enquire about space" }).click();
    await expect(page.locator("[data-selected-spaces]")).toContainText(title);
  }
});

test("disabled browser storage gives honest recovery without losing the form", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Storage blocked", "SecurityError");
    };
  });
  await page.goto("/spaces/gallery-lounge/");
  await page
    .getByRole("button", {
      name: "Save space: The gallery lounge",
      exact: true,
    })
    .click();
  await expect(page.locator("[data-save-feedback]:visible")).toContainText(
    "could not save",
  );
  await expect(page.locator("[data-saved-count]")).toHaveText("0");
  await page.getByRole("link", { name: "Enquire about space" }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Local draft");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("local@example.com");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("A local enquiry that cannot use browser storage.");
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page).toHaveURL(/enquiry\/\?space=gallery-lounge/);
  await expect(page.locator("[data-enquiry-status]")).toContainText(
    "storage is unavailable",
  );
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry instead" }).click();
  expect((await downloaded).suggestedFilename()).toBe("LAVA-enquiry.txt");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Local draft",
  );
});

test("invalid storage and direct review/ready entry recover safely", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "lava.saved.v1",
      '["unknown",42,"open-terrace","open-terrace"]',
    );
    sessionStorage.setItem(
      "lava.enquiry.v1",
      '{"name":null,"spaces":["unknown"]}',
    );
  });
  await page.goto("/saved/");
  await expect(page.locator("[data-shortlist-count]")).toHaveText(
    "1 saved space",
  );
  for (const route of ["/enquiry/review/", "/enquiry/ready/"]) {
    await page.goto(route);
    await expect(page.locator("[data-draft-missing]")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create an enquiry" }),
    ).toBeVisible();
  }
});

test("WCAG AA on every page family and the saved selection", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("lava.saved.v1", '["gallery-lounge"]');
    sessionStorage.setItem(
      "lava.enquiry.v1",
      JSON.stringify({
        name: "Avery",
        email: "avery@example.com",
        interest: "Architecture and spaces",
        message: "An accessible enquiry about the gallery lounge.",
        spaces: ["gallery-lounge"],
      }),
    );
  });
  for (const route of routes) {
    await page.goto(`${route}?view=still`);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
});

test("unknown routes return a designed 404 and canonical routes redirect", async ({
  page,
  request,
}) => {
  const response = await page.goto("/spaces/does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "A different direction.",
  );
  await page.getByRole("link", { name: "Explore spaces", exact: true }).click();
  await expect(page).toHaveURL(/\/spaces\/$/);
  const redirect = await request.get("/spaces", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/spaces/");
});
