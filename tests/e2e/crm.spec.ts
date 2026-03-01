import { test, expect } from '@playwright/test';

test.describe('CRM Module', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login or use a test session if needed
        await page.goto('/login');
        await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL || 'test@example.com');
        await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD || 'testpassword');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test('user can create a contact and see it in the list', async ({ page }) => {
        await page.goto('/dashboard/crm');
        await page.getByRole('button', { name: /new contact/i }).click();
        await page.getByLabel(/first name/i).fill('John');
        await page.getByLabel(/last name/i).fill('Doe');
        await page.getByLabel(/email/i).fill('john.doe.test@example.com');
        await page.getByRole('button', { name: /save/i }).click();
        await expect(page.getByText('john.doe.test@example.com')).toBeVisible();
    });
});
