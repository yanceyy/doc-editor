import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5173");
});

test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Document Editor/);
});
