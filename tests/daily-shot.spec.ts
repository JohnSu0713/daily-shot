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
  await page.getByRole("button", { name: "EN", exact: true }).click();
});

test("daily learning flow persists into the journal", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Daily Shot home" })).toBeVisible();
  await expect(page.locator(".photo")).toBeVisible();
  await expect(page.locator(".caption-row strong")).not.toBeEmpty();
  await expect(page.getByLabel("STUDY THE FRAME")).toBeVisible();

  await page.locator(".photo").click({ position: { x: 80, y: 80 } });
  await expect(page.locator(".focus-marker")).toBeVisible();

  await page.getByRole("button", { name: "B&W", exact: true }).click();
  await expect(page.locator(".photo")).toHaveClass(/study-mono/);
  await page.getByRole("button", { name: "Thirds", exact: true }).click();
  await expect(page.locator(".thirds-grid")).toBeVisible();
  await page.getByRole("button", { name: "Clean", exact: true }).click();

  await page.getByRole("button", { name: "Start 30s look" }).click();
  await expect(page.getByText("Just look. No judging.")).toBeVisible();

  const note = "I noticed the close framing and her direct eyes.";
  await page.getByPlaceholder("One sentence is enough…").fill(note);
  await page.locator(".reflection .reveal-note-button").click();

  await expect(page.getByText("TODAY’S CONCEPT")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Try it today" })).toBeVisible();
  await expect(page.locator(".keyword-section")).toBeVisible();

  await page.getByRole("button", { name: "Complete today" }).click();
  await expect(page.getByRole("button", { name: "✓ Saved for today" })).toBeVisible();

  await page.getByRole("button", { name: /Journal/ }).click();
  await expect(page.locator(".journal-title h1")).toContainText("Learning");
  await expect(page.locator(".rhythm-card")).toBeVisible();
  await expect(page.locator(".entries blockquote")).toContainText(note);
  await expect(page.locator(".stats article").first()).toContainText("1");

  await page.reload();
  await page.getByRole("button", { name: /Journal/ }).click();
  await expect(page.locator(".entries blockquote")).toContainText(note);
});

test("study lab keyboard shortcuts change the photograph", async ({ page }) => {
  await page.keyboard.press("g");
  await expect(page.locator(".photo")).toHaveClass(/study-thirds/);
  await expect(page.locator(".thirds-grid")).toBeVisible();

  await page.keyboard.press("b");
  await expect(page.locator(".photo")).toHaveClass(/study-mono/);

  await page.keyboard.press("s");
  await expect(page.locator(".photo")).toHaveClass(/study-squint/);

  await page.keyboard.press("Escape");
  await expect(page.locator(".photo")).toHaveClass(/study-clean/);
});

test("language and theme preferences persist", async ({ page }) => {
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  await expect(page.getByRole("button", { name: "今日", exact: true })).toBeVisible();
  await expect(page.getByLabel("觀看工具")).toBeVisible();

  await page.getByRole("button", { name: "Dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.getByRole("button", { name: "今日", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
