import { test as base, type Page } from "@playwright/test";
import path from "path";

// ─── Auth storage state ───────────────────────────────────────────────────────

const AUTH_STORAGE = path.join(__dirname, ".auth-state.json");

/**
 * Performs login via UI and saves the NextAuth session cookies.
 * Subsequent tests can reuse this state instead of logging in every time.
 */
export async function loginAndSave(
  page: Page,
  email = process.env.TEST_EMAIL ?? "test@example.com",
  password = process.env.TEST_PASSWORD ?? "test123"
) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForURL("**/home");
  await page.context().storageState({ path: AUTH_STORAGE });
}

// ─── Fixture: authenticated page ─────────────────────────────────────────────

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    // Try to reuse saved auth state; if missing, fall back to fresh context
    let context;
    try {
      const fs = await import("fs");
      if (fs.existsSync(AUTH_STORAGE)) {
        context = await browser.newContext({ storageState: AUTH_STORAGE });
      } else {
        context = await browser.newContext();
        const page = await context.newPage();
        await loginAndSave(page);
        await context.close();
        context = await browser.newContext({ storageState: AUTH_STORAGE });
      }
    } catch {
      context = await browser.newContext();
    }
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
