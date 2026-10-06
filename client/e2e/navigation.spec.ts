import { test, expect } from '@playwright/test'

test.describe('Public Navigation & Route Guards', () => {
  test('redirects unauthorized access to /search to /login', async ({ page }) => {
    await page.goto('/search')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects unauthorized access to /chat to /login', async ({ page }) => {
    await page.goto('/chat')
    await expect(page).toHaveURL(/\/login/)
  })

  test('handles unknown routes by redirecting to login for guest', async ({ page }) => {
    await page.goto('/some-nonexistent-path')
    await expect(page).toHaveURL(/\/login/)
  })
})
