import { test, expect} from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Články' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Články' }).click();
  await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(3).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
    await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    
  }
}

async function deleteExistingEntryEN(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Články' }).click();
  await page.getByLabel('Názov (anglicky))').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(3).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
    await page.getByLabel('Názov (anglicky))').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    
  }
}

test('vytvorenie_clanka', async ({ page}) => {
  let success = false;
  attempts = 0;
  const title = 'clanok1';
  while (!success && attempts < 2) {
    try {
      attempts++;
      await deleteExistingEntry(page, title);
      await page.getByRole('button', { name: 'plus' }).click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.locator('#title_sk').fill(title);
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
      await iframe.locator('body').fill('skusobny text');
      await page.getByRole('button', { name: 'Uložiť' }).click()
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill(title);
      await page.getByRole('button', { name: 'search' }).nth(3).click();
      await page.getByRole('button', { name: 'edit' }).click();
      await expect(page.locator('#title_sk').inputValue()).resolves.toBe('clanok1');
      success = true;
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}`);
      await page.getByRole('link', { name: 'Články' }).click();
      if (attempts >= 2) {
        throw error; 
      }
    }
  }
});

test('opätovne_vytvorenie_SK_clanka', async ({ page }) => {
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByRole('button', { name: 'plus' }).click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.locator('#title_sk').fill('clanok1');
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
      await iframe.locator('body').fill('skusobny text');
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Položka s rovnakým názvom už existuje. Musíte zadať iný názov.")');
      await expect(locator.nth(0)).toHaveText('Položka s rovnakým názvom už existuje. Musíte zadať iný názov.', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      success = true;
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}`);
      await page.getByRole('link', { name: 'Články' }).click();
      if (attempts >= 2) {
        throw error; 
      }
    }
  }
});

test('vytvorenie_EN_clanka', async ({ page }) => {
  const title = 'clanok2'; 
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) { 
    try {
      attempts++;
      await deleteExistingEntryEN(page, title);
      await page.getByRole('button', { name: 'plus' }).click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator1 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator1.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.locator('#title_en').fill(title);
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
      await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.', { timeout: 10000 });
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
      await iframe.locator('body').fill('skusobny test');
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill(title);
      await page.getByRole('button', { name: 'search' }).nth(3).click();
      await page.getByRole('button', { name: 'edit' }).click();
      await expect(page.locator('#title_en').inputValue()).resolves.toBe('clanok2');
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});

test('vytvorenie_SK/EN_clanka', async ({ page }) => {
  const title = 'clanok3'; 
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
      await page.locator('#title_en').fill(title);
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
      await iframe.locator('body').fill('skusobny test');
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené');
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill(title);
      await page.getByRole('button', { name: 'search' }).nth(3).click();
      await page.getByRole('button', { name: 'edit' }).click();
      await expect(page.locator('#title_sk').inputValue()).resolves.toBe('clanok3');
      await expect(page.locator('#title_en').inputValue()).resolves.toBe('clanok3');
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});


test('zmena_text_obrazok_subor', async ({ page }) => {
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) { 
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('clanok1');
      await page.getByRole('button', { name: 'search' }).nth(3).click();
      await page.getByRole('button', { name: 'edit' }).click();
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0); 
      await iframe.locator('body').fill('upraveny text ');
      await page.getByLabel('Pridať súbor').first().click();
      const handle = page.locator('input[type="file"]');
      await handle.setInputFiles("files/testovaci_subor.txt");
      await page.getByRole('button', { name: 'Nahrať' }).click();
      await page.getByLabel('Pridať obrázok').first().click();
      const handle1 = page.locator('input[type="file"]').nth(0);
      await handle1.setInputFiles("files/neviem.png");
      await page.getByRole('button', { name: 'Save' }).click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div.ant-notification-notice-message:has-text("Úspešne uložené")');
      await expect(locator).toHaveText('Úspešne uložené');
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'eye' }).click();
      const page1Promise = page.waitForEvent('popup');
      const imageLocator = page.locator('img[src$="neviem.png"]').nth(0);
      await expect(imageLocator).toBeVisible({ timeout: 5000 });
      await page.getByRole('link', { name: 'testovaci_subor' }).click();
      const page1 = await page1Promise;
      await expect(page1.getByText('text zo subora')).toBeVisible();
      await page1.close();
      await page.goto('https://fresh.fri.uniza.sk/cms/articles');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      success = true;
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}, ${error}`);
      await page.goto('https://fresh.fri.uniza.sk/cms/articles');
      if (attempts >= 2) {
          throw error;
        }
      }
    }
});

test('vyhladanie_pod_inym_pouzivatelom', async ({ page }) => {
  let success = false;
  attempts = 0;

  while (!success && attempts < 2) { 
    try {
      attempts++;
      await page.goto('https://fresh.fri.uniza.sk/cms/login-as-user');
      await page.waitForLoadState('networkidle');
      await page.getByText('doc. Ing. Patrik Hrkút , PhD.').click();
      await page.getByLabel('Vybrať používateľa').fill('Ing. Štefan Toth , PhD.');
      await page.getByText('Ing. Štefan Toth , PhD.').click();
      await page.getByRole('button', { name: 'Prihlásiť' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.getByRole('link', { name: 'Články' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('clanok1');
      await page.getByRole('button', { name: 'search' }).nth(3).click();
      await expect(page.locator('text=test11')).toHaveCount(0);
      await page.waitForLoadState('networkidle');
      success = true;
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}`);
      await page.getByRole('link', { name: 'Články' }).click();
      if (attempts >= 2) {
        throw error; 
      }
    }
  }
});

test('mazanie_clanka', async ({ page }) => {
  let success = false;
  attempts = 0; 
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('clanok1');
      await page.getByRole('button', { name: 'search' }).nth(3).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator1).toHaveText('Položka úspešne vymazaná');  
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('clanok3');
      await page.getByRole('button', { name: 'search' }).nth(3).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator2).toHaveText('Položka úspešne vymazaná');
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').nth(1).fill('clanok2');
      await page.getByRole('searchbox').nth(1).press('Enter');
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator3 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator3).toHaveText('Položka úspešne vymazaná');
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
  await page.close();
});
