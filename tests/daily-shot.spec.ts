import { expect, test } from "@playwright/test";

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEAQH/2rWQGQAAAABJRU5ErkJggg==",
  "base64"
);

test.beforeEach(async ({ page }) => {
  await page.route(/wikimedia\.org/, async (route) => {
    await route.fulfill({ status: 200, contentType: "image/png", body: transparentPng });
  });
  await page.goto("/daily-shot/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("daily learning flow persists into the journal", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Daily Shot home" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Look first\./ })).toBeVisible();
  await expect(page.locator(".photo")).toBeVisible();
  await expect(page.locator(".caption-row strong")).not.toBeEmpty();

  await page.getByRole("button", { name: "Start 30s look" }).click();
  await expect(page.getByText("Just look. No judging.")).toBeVisible();

  await page.getByRole("button", { name: /Reveal today’s lesson/ }).click();
  await expect(page.getByText("TODAY’S CONCEPT")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Try it today" })).toBeVisible();

  const note = "I noticed how the frame controls where my eye pauses.";
  await page.getByPlaceholder("One sentence is enough…").fill(note);
  await page.getByRole("button", { name: "Complete today" }).click();
  await expect(page.getByRole("button", { name: "✓ Saved for today" })).toBeVisible();

  await page.getByRole("button", { name: /Journal/ }).click();
  await expect(page.getByText("Learning journal.")).toBeVisible();
  await expect(page.getByText(note)).toBeVisible();
  await expect(page.locator(".stats article").first()).toContainText("1");

  await page.reload();
  await page.getByRole("button", { name: /Journal/ }).click();
  await expect(page.getByText(note)).toBeVisible();
});

test("PWA shell and source link are present", async ({ page, request }) => {
  const manifest = await request.get("/daily-shot/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  const body = await manifest.json();
  expect(body.name).toContain("Daily Shot");
  expect(body.display).toBe("standalone");

  await expect(page.locator('a:has-text("Source")')).toHaveAttribute("href", /commons\.wikimedia\.org/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/daily-shot/manifest.webmanifest");
});
