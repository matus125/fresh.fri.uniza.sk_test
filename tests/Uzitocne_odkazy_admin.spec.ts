import { test, expect} from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'užitočné odkazy' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByLabel('Názov').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(2).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná',{ timeout: 10000 });
  }
  await page.getByLabel('Názov').getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: 'close-circle' }).click();
}

test('vytvorenie_odkazu', async ({ page }) => {
  let success = false;
  attempts = 0;
  const title = 'test1';
  test.setTimeout(100000);
    
  while (!success && attempts < 2) {
    try {
      await deleteExistingEntry(page, title);
      await page.getByRole('button', { name: 'plus' }).click();
      await page.getByLabel('Názov (slovensky)').fill('test1');
      await page.getByLabel('URL SK').fill('https://www.google.com');

      await page.getByLabel('Nová').click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      await expect(page.locator('div:has-text("Úspešne uložené")').nth(5)).toHaveText('Úspešne uložené',{ timeout: 10000 });
      await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
      const link = page.getByRole('link', { name: title + "Nové" });
      await link.click({ timeout: 10000 });
      await expect(page).toHaveURL('https://www.google.com');
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});

test('mazanie_odkazu', async ({ page }) => {
  let success = false;
  attempts = 0;
    
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByLabel('Názov').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator1).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });  
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
  await page.close();
});