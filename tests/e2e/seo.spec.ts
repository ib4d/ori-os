import { test, expect } from '@playwright/test';

test.describe('SEO Studio', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL || 'test@example.com');
        await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD || 'testpassword');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test('user can create an SEO project', async ({ page }) => {
        await page.goto('/dashboard/seo-studio');
        await page.getByRole('button', { name: /new project/i }).click();
        await page.getByLabel(/project name/i).fill('E2E SEO Project');
        await page.getByLabel(/domain/i).fill('example.com');
        await page.getByRole('button', { name: /create|save/i }).click();
        await expect(page.getByText('E2E SEO Project')).toBeVisible();
        await expect(page.getByText('example.com')).toBeVisible();
    });
});
