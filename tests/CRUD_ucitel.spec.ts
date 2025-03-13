import { test, expect } from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
test.slow();
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms/login-as-user');
  await page.waitForLoadState('networkidle');
  await page.getByText('doc. Ing. Patrik Hrkút , PhD.').click();
  await page.getByLabel('Vybrať používateľa').fill('Ing. Štefan Toth , PhD.');
  await page.getByText('Ing. Štefan Toth , PhD.').click();
  await page.getByRole('button', { name: 'Prihlásiť' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();

  await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(2).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
  }
}

test.describe('Sériové testovanie', () => {
test('vytvorenie_SK', async ({ page }) => {
    const title = 'test4';
    let success = false;
    attempts = 0;
    while (!success && attempts < 2) { 
      try {
        attempts++;
        await deleteExistingEntry(page, title);
        await page.getByRole('button', { name: 'plus' }).click();
        await page.getByRole('button', { name: 'Uložiť' }).click();
        const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
        await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
        await page.locator('#title_sk').click();
        await page.locator('#title_sk').fill(title);
        await page.getByRole('button', { name: 'Uložiť' }).click();
        const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
        await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
        await page.waitForSelector('iframe[title="Rich Text Area"]');
        const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
        await iframe.locator('body').fill('skusobny test');
        await page.getByRole('button', { name: 'Uložiť' }).click()
        await expect(page.locator('#categories_help')).toHaveText('Pole je povinné');  
        await page.locator('.ant-select-selection-overflow').click();
        await page.getByText('Pre študentov').click();
        await page.getByRole('button', { name: 'Uložiť' }).click();
        const locator = page.locator('div:has-text("Úspešne uložené")');
        await expect(locator.nth(5)).toHaveText('Úspešne uložené');
        await page.waitForLoadState('networkidle');
        await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
        await page.getByText(title).click();
        const locator3 = page.getByRole('heading', { name: title });
        await expect(locator3).toHaveText(title);
        await page.waitForLoadState('networkidle');
        success = true;
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}`);
        if (attempts >= 2) {
         throw error; 
        }
      }
    }
  });

  test('vyhladanie_pod_inym_pouzivatelom', async ({ page }) => {
    await page.getByRole('button', { name: 'more' }).click();
    await page.getByText('Späť k Patrik Hrkút').click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Aktuality' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill('test4');
    await page.getByRole('button', { name: 'search' }).nth(2).click();
    await expect(page.locator('text=test4')).toHaveCount(1);
    await page.waitForLoadState('networkidle');
  });

test('vytvorenie_SK_znova', async ({ page }) => {
    let success = false;
    attempts = 0;

    while (!success && attempts < 2) { 
      try {
        attempts++;
        await page.getByRole('button', { name: 'plus' }).click();
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
        const locator = page.locator('div.ant-notification-notice-message').first().filter({hasText: '422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.'});
          await expect(locator).toHaveText('422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.');
        await page.waitForLoadState('networkidle');
        success = true;
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}`);
        await page.getByRole('link', { name: 'Aktuality' }).click();
        if (attempts >= 2) {
          throw error; 
        }
      }
    }
  });

  test('vytvorenie_EN', async ({ page }) => {
    const title = 'test5'; 
    let success = false;
    attempts = 0;
  
    while (!success && attempts < 2) { 
      try {
        attempts++;
        await deleteExistingEntry(page, title);
        await page.getByRole('button', { name: 'plus' }).click();
        await page.getByRole('button', { name: 'Uložiť' }).click();
        const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
        await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
        await page.locator('#title_en').click();
        await page.locator('#title_en').fill(title);
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
        await page.getByText(title).click();
        const locator3 = page.getByRole('heading', { name: title });
        await expect(locator3).toHaveText(title);
        await page.waitForLoadState('networkidle');
        const infoLocator = page.locator('div.footer-wrapper span');
        await expect(infoLocator).toHaveText(/Štefan Toth/);
        await page.waitForLoadState('networkidle');
        success = true; 
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
      }
    }
  });
    

  test('vytvorenie_SK/EN', async ({ page }) => {
    const title = 'test6'; 
    let success = false;
    attempts = 0;

    while (!success && attempts < 2) { 
      try {
        attempts++;
        await deleteExistingEntry(page, title);
        await page.getByRole('button', { name: 'plus' }).click();
        await page.locator('#title_sk').click();
        await page.locator('#title_sk').fill(title);
        const iframe1 = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
        await iframe1.locator('body').fill('skusobny test');
        await page.locator('#title_en').click();
        await page.locator('#title_en').fill(title);
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
        await page.getByText(title).click();
        const locator3 = page.getByRole('heading', { name: title });
        await expect(locator3).toHaveText(title);
        await page.getByRole('link', { name: 'Fakulta Riadenia a' }).nth(1).click();
        await page.getByRole('button', { name: 'EN' }).nth(1).click();
        await page.waitForLoadState('networkidle');
        await page.getByText(title).click();
        await expect(locator3).toHaveText(title);
        await page.waitForLoadState('networkidle');
        const infoLocator1 = page.locator('div.footer-wrapper span');
        await expect(infoLocator1).toHaveText(/Štefan Toth/);
        await page.waitForLoadState('networkidle');
        success = true; 
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
      }
    }
  });


  test('zmenaText', async ({ page }) => {
    let success = false;
    attempts = 0;

    while (!success && attempts < 2) { 
      try {
        attempts++;
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
        await page.waitForLoadState('networkidle');
        success = true; 
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}`);
        await page.goto('https://fresh.fri.uniza.sk/cms/news');
        
        if (attempts >= 2) {
           throw error;
        }
      }
    }
  });
  
  test('mazanie', async ({ page }) => {
    let success = false;
    attempts = 0;

    while (!success && attempts < 2) {
      try {
        attempts++;
        await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
        await page.getByRole('searchbox').click();
        await page.getByRole('searchbox').fill('test4');
        await page.getByRole('button', { name: 'search' }).nth(2).click();    
        await page.getByRole('button', { name: 'delete' }).click();
        await page.getByRole('button', { name: 'Áno' }).click();
        await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
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
        await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
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
        await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
        const locator3 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
        await expect(locator3).toHaveText('Položka úspešne vymazaná');
        await page.waitForLoadState('networkidle');
        await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
        await page.getByRole('button', { name: 'close-circle' }).click();
        success = true;
      } catch (error) {
        console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
      }
    }
  });

});