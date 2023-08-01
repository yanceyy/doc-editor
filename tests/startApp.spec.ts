import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
});

test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Document Editor/);
});
