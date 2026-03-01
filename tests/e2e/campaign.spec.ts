import { test, expect } from '@playwright/test';

test.describe('Engagement — Campaign Creation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL || 'test@example.com');
        await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD || 'testpassword');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test('user can create a campaign and see it listed as DRAFT', async ({ page }) => {
        await page.goto('/dashboard/engagement');
        await page.getByRole('button', { name: /new campaign/i }).click();
        await page.getByLabel(/campaign name/i).fill('E2E Test Campaign');
        await page.getByRole('radio', { name: /book meetings/i }).click();
        await page.getByRole('button', { name: /continue|next/i }).click();
        await page.getByRole('button', { name: /save as draft/i }).click();
        await expect(page.getByText('E2E Test Campaign')).toBeVisible();
        await expect(page.getByText(/draft/i)).toBeVisible();
    });
});
Joe
