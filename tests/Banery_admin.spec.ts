import { test, expect} from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Banery' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByLabel('Popis').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(2).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
  }
  await page.getByLabel('popis').getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: 'close-circle' }).click();
}

test('vytvorenie Banera', async ({ page }) => {
  test.setTimeout(100000);
  const title = 'neviem';
  await deleteExistingEntry(page, title);
  await page.getByRole('button', { name: 'plus' }).click();
  await page.getByRole('button', { name: 'Uložiť' }).click();
  for (const id of ['image_object_help', 'target_url_help', 'meta_name_help']) {
    await expect(page.locator(`#${id}`)).toHaveText('Pole je povinné');
  }
  await page.locator('input[type="file"]').nth(0).setInputFiles('files/neviem.png');
  await page.getByLabel('URL').fill('https://fresh.fri.uniza.sk/cms');
  await page.getByLabel('Popis').fill(title);
  await page.getByRole('button', { name: 'Uložiť' }).click();
  await expect(page.locator('div:has-text("Úspešne uložené")').nth(5)).toHaveText('Úspešne uložené');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
  await page.waitForTimeout(4000);
  const imageLocator = page.locator('.slick-slide.slick-active.slick-current img[src*="neviem.png"]');
  await expect(imageLocator).toBeVisible({ timeout: 20000 });
  await imageLocator.click();
  await expect(page).toHaveURL('https://fresh.fri.uniza.sk/cms');
});

test('mazanie', async ({ page }) => {
  let success = false;
  attempts = 0;
    
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByLabel('popis').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('neviem');
      await page.getByRole('button', { name: 'search' }).nth(2).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator1).toHaveText('Položka úspešne vymazaná');  
      await page.waitForLoadState('networkidle');
      await page.getByLabel('popis').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});