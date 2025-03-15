import { test, expect} from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Články' }).click();
  await page.waitForLoadState('networkidle');
});


  test('vytvorenie clanka', async ({ page}) => {
    await page.getByRole('button', { name: 'plus' }).click();
            await page.getByRole('button', { name: 'Uložiť' }).click();
            const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
            await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
            await page.locator('#title_sk').click();
            await page.locator('#title_sk').fill('clanok1');
            await page.getByRole('button', { name: 'Uložiť' }).click();
            const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
            await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
            await page.waitForSelector('iframe[title="Rich Text Area"]');
            const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
            await iframe.locator('body').fill('skusobny test');
            await page.getByRole('button', { name: 'Uložiť' }).click()
            const locator = page.locator('div:has-text("Úspešne uložené")');
            await expect(locator.nth(5)).toHaveText('Úspešne uložené');
            await page.waitForLoadState('networkidle');
  });
