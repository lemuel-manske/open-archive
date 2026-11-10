import AxeBuilder from "@axe-core/playwright";

import {
  defineConfig,
  expect as baseExpect,
  test as componentTest,
} from "@playwright/experimental-ct-react";
import type { ComponentFixtures } from "@playwright/experimental-ct-react";

import type { Page } from "@playwright/test";

const expect = baseExpect.extend({
  async noAccessibilityViolations(page: Page) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();

    return {
      pass: results.violations.length === 0,

      message: () =>
        `Expected no accessibility violations.\n${JSON.stringify(results.violations, null, 2)}`,
    };
  },
});

const test = componentTest.extend<{ render: ComponentFixtures["mount"] }>({
  render: async ({ mount }, use) => {
    await use(mount);
  },
});

const config = defineConfig({
  testDir: "./src",
  testMatch: "**/*.test.tsx",
  fullyParallel: true,
  workers: 2,

  use: {
    browserName: "chromium",
    trace: "retain-on-failure",

    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
});

export { config, expect, test, type Page };
