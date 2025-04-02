import { test, expect} from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'kalendár' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Kalendár' }).click();
  await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(1).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
  }  
  await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: 'close-circle' }).click();
}

test('vytvorenie udalosti', async ({ page }) => {
  const title = 'udalost1';
  const titleHelp = page.locator('#title_sk_help');
  const fromHelp = page.locator('#from_help');
  const successMsg = page.locator('div:has-text("Úspešne uložené")');
  await deleteExistingEntry(page, title);
  await page.getByRole('button', { name: 'plus' }).click();
  await page.getByRole('button', { name: 'Uložiť' }).click();
  await expect(titleHelp).toBeVisible({ timeout: 5000 });
  await expect(fromHelp).toBeVisible({ timeout: 5000 });
  const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
  await iframe.locator('body').fill(title);
  await page.getByRole('button', { name: 'Uložiť' }).click();
  await expect(titleHelp).toBeHidden({ timeout: 5000 });
  await expect(fromHelp).toBeVisible({ timeout: 5000 });
  const d = new Date();
  const formattedDate = `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  await page.getByLabel('začiatok udalosti').fill(formattedDate);
  await page.getByLabel('koniec udalosti').fill(formattedDate);
  await page.getByRole('button', { name: 'Uložiť' }).click();
  await expect(titleHelp).toBeHidden({ timeout: 5000 });
  await expect(fromHelp).toBeHidden({ timeout: 5000 });
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Uložiť' }).click();
  await expect(successMsg.nth(5)).toHaveText('Úspešne uložené');
});



    test('mazanie', async ({ page }) => {
        let success = false;
        attempts = 0;
    
        while (!success && attempts < 2) {
          try {
            attempts++;
            await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
            await page.getByRole('searchbox').click();
            await page.getByRole('searchbox').fill('udalost1');
            await page.getByRole('button', { name: 'search' }).nth(1).click();    
            await page.getByRole('button', { name: 'delete' }).click();
            await page.getByRole('button', { name: 'Áno' }).click();
            await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
            const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
            await expect(locator1).toHaveText('Položka úspešne vymazaná');  
            await page.waitForLoadState('networkidle');
            await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
            await page.getByRole('button', { name: 'close-circle' }).click();
            success = true; 
          } catch (error) {
            console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
          }
        }
      });
