import { test, expect } from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
test.slow();

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.locator('div').filter({ hasText: /^PPatrik Hrkút$/ }).getByRole('button').click();
  await page.getByText('Prihlásiť sa ako iný použí').click();
  await page.getByText('doc. Ing. Patrik Hrkút , PhD.').click();
  await page.getByLabel('Vybrať používateľa').fill('Ing. Štefan Toth , PhD.');
  await page.getByText('Ing. Štefan Toth , PhD.').click();
  await page.getByRole('button', { name: 'Prihlásiť' }).click();
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
    await page.locator('#title_sk').fill('test4');
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
    await page.getByText('test4').click();
    const locator3 = page.getByRole('heading', { name: 'test4' });
    await expect(locator3).toHaveText('test4');
    const infoLocator = page.locator('div.footer-wrapper span');
    await expect(infoLocator).toHaveText(/Štefan Toth/);
    await page.waitForLoadState('networkidle');
  });

  test('vytvorenie_SK_znova', async ({ page }) => {
    await page.getByRole('button', { name: 'plus' }).click()
    await page.getByRole('button', { name: 'Uložiť' }).click();
    const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
    await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
    await page.locator('#title_sk').click();
    await page.locator('#title_sk').fill('test4');
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
    const locator = page.locator('div.ant-notification-notice-message').nth(0).filter({ hasText: '422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.' });
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
    await page.locator('#title_en').fill('test5');
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
    await page.getByText('test5').click();
    const locator3 = page.getByRole('heading', { name: 'test5' });
    await expect(locator3).toHaveText('test5');
    const infoLocator = page.locator('div.footer-wrapper span');
    await expect(infoLocator).toHaveText(/Štefan Toth/);
    await page.waitForLoadState('networkidle');
  });

  test('vytvorenie_SK/EN', async ({ page }) => {
    await page.getByRole('button', { name: 'plus' }).click()
    await page.locator('#title_sk').click();
    await page.locator('#title_sk').fill('test6');
    const iframe1 = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
    await iframe1.locator('body').fill('skusobny test');
    await page.locator('#title_en').click();
    await page.locator('#title_en').fill('test6');
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
    await page.getByText('test6').click();
    const locator3 = page.getByRole('heading', { name: 'test6' });
    await expect(locator3).toHaveText('test6');
    const infoLocator = page.locator('div.footer-wrapper span');
    await expect(infoLocator).toHaveText(/Štefan Toth/);
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Fakulta Riadenia a' }).nth(1).click();
    await page.getByRole('button', { name: 'EN' }).nth(1).click();
    await page.getByText('test6').click();
    await expect(locator3).toHaveText('test6');
    const infoLocator1 = page.locator('div.footer-wrapper span');
    await expect(infoLocator1).toHaveText(/Štefan Toth/);
    await page.waitForLoadState('networkidle');
  });

  test('zmenaText', async ({ page }) => {
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test4');
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
    await page.getByText('test4').click();
    const locator2 = page.getByText('upraveny text');
    await expect(locator2).toHaveText('upraveny text');
    const infoLocator = page.locator('div.footer-wrapper span');
    await expect(infoLocator).toHaveText(/Štefan Toth/);
    await page.waitForLoadState('networkidle');
  });

  test('mazanie', async ({ page }) => {
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test4');
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
    await page.getByRole('searchbox').fill('test6');
    await page.getByRole('button', { name: 'search' }).nth(2).click();    
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').nth(1).fill('test5');
    await page.getByRole('searchbox').nth(1).press('Enter');
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator3 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator3).toHaveText('Položka úspešne vymazaná');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
  });
});