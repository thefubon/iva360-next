import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const defaultServerURL = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'

export interface LoginOptions {
  page: Page
  serverURL?: string
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 */
export async function login({
  page,
  serverURL = defaultServerURL,
  user,
}: LoginOptions): Promise<void> {
  await page.goto(`${serverURL}/admin/login`)

  await page.locator('#field-email').waitFor({ state: 'visible', timeout: 60_000 })
  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL(`${serverURL}/admin`)

  const dashboardArtifact = page.locator('span[title="Панель"]')
  await expect(dashboardArtifact).toBeVisible()
}
