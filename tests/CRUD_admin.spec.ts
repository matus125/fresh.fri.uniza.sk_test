import { test, expect } from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
test.slow();


test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.waitForLoadState('networkidle');
});

test.describe('Sériové testovanie', () => {
  test('vytvorenie_SK', async ({ page }) => {
    await page.getByRole('button', { name: 'plus' }).click()
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.locator('#title_sk').click();
    await page.locator('#title_sk').fill('test1');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.waitForSelector('iframe[title="Rich Text Area"]');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
    await iframe.locator('body').fill('skusobny test');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    await expect(page.locator('#categories_help')).toHaveText('Pole je povinné');  
    await page.locator('.ant-select-selection-overflow').click();
    await page.getByText('Pre študentov').click();
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator = page.locator('div:has-text("Úspešne uložené")');
    await expect(locator.nth(5)).toHaveText('Úspešne uložené');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
    await page.getByText('test1').click();
    const locator3 = page.getByRole('heading', { name: 'test1' });
    await expect(locator3).toHaveText('test1');
    await page.waitForLoadState('networkidle');
  });

  test('vytvorenie_SK_znova', async ({ page }) => {
    await page.getByRole('button', { name: 'plus' }).click()
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.locator('#title_sk').click();
    await page.locator('#title_sk').fill('test1');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.waitForSelector('iframe[title="Rich Text Area"]');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
    await iframe.locator('body').fill('skusobny test');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    await expect(page.locator('#categories_help')).toHaveText('Pole je povinné');  
    await page.locator('.ant-select-selection-overflow').click();
    await page.getByText('Pre študentov').click();
    await page.getByRole('button', { name: 'Uložiť' }).click();
    await page.waitForSelector('div.ant-notification-notice-message', { state: 'visible' });
    const locator = page.locator('div.ant-notification-notice-message').filter({ hasText: '422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.' });
    await expect(locator).toHaveText('422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.');
    await page.waitForLoadState('networkidle');
  });

  test('vytvorenie_EN', async ({ page }) => {
    test.setTimeout(1200000);
    await page.getByRole('button', { name: 'plus' }).click()
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.locator('#title_en').click();
    await page.locator('#title_en').fill('test2');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.waitForSelector('iframe[title="Rich Text Area"]');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
    await iframe.locator('body').fill('skusobny test');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    await expect(page.locator('#categories_help')).toHaveText('Pole je povinné');  
    await page.locator('.ant-select-selection-overflow').click();
    await page.getByText('Pre študentov').click();
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator = page.locator('div:has-text("Úspešne uložené")');
    await expect(locator.nth(5)).toHaveText('Úspešne uložené');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
    await page.getByRole('button', { name: 'EN' }).nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.getByText('test2').click();
    const locator3 = page.getByRole('heading', { name: 'test2' });
    await expect(locator3).toHaveText('test2');
    await page.waitForLoadState('networkidle');
  });

  test('vytvorenie_SK/EN', async ({ page }) => {
    test.slow();

    await page.getByRole('button', { name: 'plus' }).click()
    await page.locator('#title_sk').click();
    await page.locator('#title_sk').fill('test3');
    const iframe1 = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
    await iframe1.locator('body').fill('skusobny test');
    await page.locator('#title_en').click();
    await page.locator('#title_en').fill('test3');
    await page.waitForSelector('iframe[title="Rich Text Area"]');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
    await iframe.locator('body').fill('skusobny test'); 
    await page.locator('.ant-select-selection-overflow').click();
    await page.getByText('Pre študentov').click();
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator = page.locator('div:has-text("Úspešne uložené")');
    await expect(locator.nth(5)).toHaveText('Úspešne uložené');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByText('test3').click();
    const locator3 = page.getByRole('heading', { name: 'test3' });
    await expect(locator3).toHaveText('test3');
    await page.getByRole('link', { name: 'Fakulta Riadenia a' }).nth(1).click();
    await page.getByRole('button', { name: 'EN' }).nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.getByText('test3').click();
    await expect(locator3).toHaveText('test3');
    await page.waitForLoadState('networkidle');
  });

  test('zmenaText', async ({ page }) => {
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test1');
    await page.getByRole('button', { name: 'search' }).nth(2).click();
    await page.getByRole('button', { name: 'edit' }).click();
    await page.waitForSelector('iframe[title="Rich Text Area"]');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0); 
    await iframe.locator('body').fill('upraveny text');
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator = page.locator('div.ant-notification-notice-message:has-text("Úspešne uložené")');
    await expect(locator).toHaveText('Úspešne uložené');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
    await page.getByText('test1').click();
    const locator2 = page.getByText('upraveny text');
    await expect(locator2).toHaveText('upraveny text');
    await page.waitForLoadState('networkidle');
  });

  test('mazanie', async ({ page }) => {
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test1');
    await page.getByRole('button', { name: 'search' }).nth(2).click();    
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator1).toHaveText('Položka úspešne vymazaná');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test3');
    await page.getByRole('button', { name: 'search' }).nth(2).click();    
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').nth(1).fill('test2');
    await page.getByRole('searchbox').nth(1).press('Enter');
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator3 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator3).toHaveText('Položka úspešne vymazaná');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    //npx playwright test --ui
    //npx playwright show-report
  });

});