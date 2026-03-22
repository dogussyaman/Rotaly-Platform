import { expect, test } from '@playwright/test'

test('about page renders brand copy', async ({ page }) => {
  await page.goto('/about')

  await expect(page.getByRole('heading', { name: 'Misyonumuz' })).toBeVisible()
})

test('terms page renders legal update badge', async ({ page }) => {
  await page.goto('/terms')

  await expect(page.getByText(/Son Güncelleme: Mart 2026/i)).toBeVisible()
})