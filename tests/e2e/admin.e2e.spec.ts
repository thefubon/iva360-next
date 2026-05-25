import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../../apps/cms/tests/helpers/seedUser'

const cmsURL = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'

test.describe('Admin Panel', () => {
  test.describe.configure({ timeout: 120_000 })

  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto(`${cmsURL}/admin`)
    await expect(page).toHaveURL(`${cmsURL}/admin`)
    const dashboardArtifact = page.locator('span[title="Панель"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto(`${cmsURL}/admin/collections/users`)
    await expect(page).toHaveURL(`${cmsURL}/admin/collections/users`)
    const listViewArtifact = page.locator('h1', { hasText: 'Пользователи' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto(`${cmsURL}/admin/collections/users/create`)
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })
})
