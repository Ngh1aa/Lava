import { test, expect } from "@playwright/test";

test("licensed GLB is self-hosted, credited and drawn in the viewer", async ({page, request}) => {
  const model = await request.get("/models/modern-office.glb");
  expect(model.status()).toBe(200);
  const binary = await model.body();
  expect(binary.subarray(0, 4).toString()).toBe("glTF");
  expect(binary.length).toBeLessThan(2_000_000);
  const jsonLength = binary.readUInt32LE(12);
  const metadata = JSON.parse(binary.subarray(20, 20 + jsonLength).toString());
  expect(metadata.asset.extras.author).toContain("CN Entertainment");
  expect(metadata.asset.extras.license).toContain("CC-BY-4.0");
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/architecture/");
  await page.locator("#showcase").scrollIntoViewIfNeeded();
  await expect(page.locator("#architecture-scene")).toHaveAttribute("data-render", "webgl");
  await expect(page.locator(".model-credit")).toContainText("CN Entertainment");
  const screenshot = await page.locator("#architecture-scene canvas").screenshot();
  const brightPixels = await page.evaluate(async (source) => {
    const image = new Image(); image.src = `data:image/png;base64,${source}`;
    await image.decode();
    const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext("2d")!; context.drawImage(image, 0, 0);
    const {data} = context.getImageData(0, 0, canvas.width, canvas.height);
    let bright = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] > 130 && data[i+1] > 130 && data[i+2] > 130) bright++;
    return bright / (canvas.width * canvas.height);
  }, screenshot.toString("base64"));
  // A loaded but invisible model must not pass just because a canvas exists.
  expect(brightPixels).toBeGreaterThan(0.01);
  await page.goto("/credits/#model-credit");
  await expect(page.locator("#model-credit")).toContainText("CC BY 4.0");
  await expect(page.getByRole("link", {name: "Original model on Sketchfab"})).toHaveAttribute("href", /3f54b8d7a7064b0da523c49187efcf60$/);
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/architecture/?view=still");
  await page.getByRole("tab", {name: "The facade"}).click();
  const poster = page.locator("#architecture-scene .scene-fallback");
  await poster.evaluate((image: HTMLImageElement) => image.decode());
  expect(await poster.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain("facade-view-mobile.webp");
});

for (const failure of ["unavailable", "invalid"]) {
  test(`GLB ${failure} retains the still perspective and navigation`, async ({page}) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/models/modern-office.glb", route => route.fulfill(
      failure === "unavailable" ? {status: 503, body: "Unavailable"} : {status: 200, body: "invalid GLB"},
    ));
    await page.goto("/");
    await expect(page.locator("#hero-scene")).toHaveAttribute("data-render", "fallback");
    await expect(page.locator("#hero-status")).toHaveText("Still perspective");
    await expect(page.locator("#hero-scene .scene-fallback")).toBeVisible();
    await expect(page.getByRole("link", {name: "Explore LAVA"})).toBeVisible();
    expect(errors).toEqual([]);
  });
}
