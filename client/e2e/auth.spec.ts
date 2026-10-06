import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('redirects unauthenticated guest from root to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('h1')).toContainText('Sign in to Twitter Social')
  })

  test('displays login form fields and registration link', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    const registerLink = page.getByRole('link', { name: /create an account/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/\/register/)
  })

  test('navigates to forgot password page', async ({ page }) => {
    await page.goto('/login')
    const forgotLink = page.getByRole('link', { name: /forgot password/i })
    await forgotLink.click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })
})
