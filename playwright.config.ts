import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "rm -rf .e2e-site && mkdir -p .e2e-site/daily-shot && cp -R out/. .e2e-site/daily-shot/ && python3 -m http.server 4173 --directory .e2e-site",
    url: "http://127.0.0.1:4173/daily-shot/",
    reuseExistingServer: false,
    timeout: 20_000,
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
  ],
});
