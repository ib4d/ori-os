import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('marketing homepage loads and shows sign in button', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/ORI-OS/i);
        const signInButton = page.getByRole('link', { name: /sign in/i });
        await expect(signInButton).toBeVisible();
    });

    test('unauthenticated user is redirected from dashboard to login', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/login|signin/);
    });
});
