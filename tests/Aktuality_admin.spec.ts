import { test, expect } from '@playwright/test';
test.use({ storageState: 'playwright/.auth/auth.json' });
let attempts= 0;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fresh.fri.uniza.sk/cms');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.waitForLoadState('networkidle');
});

async function deleteExistingEntry(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(2).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    await page.waitForTimeout(5000);
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
    await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
  }
}

async function deleteExistingEntryEN(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Aktuality' }).click();
  await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(1).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    await page.waitForTimeout(5000);
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
    await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
  }
}


test('vytvorenie_SK_aktuality', async ({ page }) => {
  const title = 'test1';
  let success = false;
  attempts = 0;
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
      await iframe.locator('body').fill('skusobny test');
      await page.getByRole('button', { name: 'Uložiť' }).click()
      await expect(page.locator('#categories_help')).toHaveText('Pole je povinné', { timeout: 10000 });  
      await page.locator('.ant-select-selection-overflow').click();
      await page.getByText('Pre študentov').click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
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

test('opätovne_vytvorenie_SK_aktuality', async ({ page }) => {
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
      await page.waitForTimeout(5000);
      await page.waitForSelector('div.ant-notification-notice-message', { state: 'visible' });
      const locator = page.locator('div.ant-notification-notice-message')
        .filter({hasText: 'Položka s rovnakým názvom už existuje. Musíte zadať iný názov.'});
      await expect(locator).toHaveText('Položka s rovnakým názvom už existuje. Musíte zadať iný názov.');
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
      await page.getByRole('link', { name: 'Aktuality' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();
      await page.reload();
      await expect(page.locator('text=test1')).toHaveCount(0);
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
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

test('zmena_Text_obrazok_subor', async ({ page }) => {
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) { 
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();
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
      await expect(locator).toHaveText('Úspešne uložené', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
      await page.getByText('test1').click();
      const locator2 = page.getByText('upraveny text');
      await expect(locator2).toHaveText('upraveny text testovaci_subor');
      await page.waitForLoadState('networkidle');
      const imageLocator = page.locator('img[src$="neviem.png"]').nth(0);
      await expect(imageLocator).toBeVisible({ timeout: 5000 });
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

test('vytvorenie_SK/EN_aktuality', async ({ page }) => {
  const title = 'test3'; 
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) { 
    try {
      attempts++;
      await deleteExistingEntry(page, title);
      await page.getByRole('button', { name: 'plus' }).click();
      await page.locator('#title_sk').fill(title);
      const iframe1 = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
      await iframe1.locator('body').fill('skusobny test');
      await page.locator('#title_en').fill(title);
      await page.waitForSelector('iframe[title="Rich Text Area"]');
      const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
      await iframe.locator('body').fill('skusobny test');
      await page.locator('.ant-select-selection-overflow').click();
      await page.getByText('Pre študentov').click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
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
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});


test('pamatanie_filtra', async ({ page }) => {
let success = false;
attempts = 0;
  while (!success && attempts < 2) { 
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('test2');
      await page.getByRole('button', { name: 'search' }).nth(2).click();
      await page.goto('https://fresh.fri.uniza.sk/cms/login-as-user');
      await page.waitForLoadState('networkidle');
      await page.getByText('doc. Ing. Patrik Hrkút , PhD.').click();
      await page.getByLabel('Vybrať používateľa').fill('Ing. Štefan Toth , PhD.');
      await page.getByText('Ing. Štefan Toth , PhD.').click();
      await page.getByRole('button', { name: 'Prihlásiť' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'Aktuality' }).click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' })).toBeVisible({ timeout: 5000 });
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      const searchValue = await page.locator('input.ant-input').inputValue();
      let ulozenaHodnota = searchValue === '' ? 'prázdne' : searchValue;
      await page.waitForLoadState('networkidle');
      console.log(ulozenaHodnota);
      expect(ulozenaHodnota).toBe('prázdne');
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}`);
    }
  }
});

test('vytvorenie_EN_aktuality', async ({ page }) => {
  const title = 'test2'; 
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
      await expect(page.locator('#categories_help')).toHaveText('Pole je povinné', { timeout: 10000 });  
      await page.locator('.ant-select-selection-overflow').click();
      await page.getByText('Pre študentov').click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
      await page.getByRole('button', { name: 'EN' }).nth(1).click();
      await page.waitForLoadState('networkidle');
      await page.getByText(title).click();
      const locator3 = page.getByRole('heading', { name: title });
      await expect(locator3).toHaveText(title), { timeout: 10000 };
      await page.waitForLoadState('networkidle');
      success = true; 
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
    }
  }
});

test('topovanie_aktuality', async ({ page }) => {
  for (let attempts = 1; attempts <= 2; attempts++) {
    try {
      await page.goto('https://fresh.fri.uniza.sk');
      await page.getByRole('button', { name: 'filter' }).click();
      await page.getByLabel('Pre študentov').check();
      const firstBefore = await page.locator('.second-title').first().textContent();
      if (firstBefore?.trim() !== 'test3') throw new Error('Prvý článok nie je test3');
      await page.goto('https://fresh.fri.uniza.sk/cms');
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Obsah' }).click();
      await page.getByRole('link', { name: 'Aktuality' }).click();
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();
      await page.getByRole('row', { name: 'test1' }).getByRole('button').first().click();
      await page.getByLabel('Zobrazovať stále navrchu').click();
      await page.getByRole('button', { name: 'Uložiť' }).click();
      const locator = page.locator('div:has-text("Úspešne uložené")');
      await expect(locator.nth(5)).toHaveText('Úspešne uložené', { timeout: 10000 });
      await page.getByRole('link', { name: 'Logo Fri Portál FRI' }).click();
      await page.getByRole('button', { name: 'filter' }).click();
      await page.getByLabel('Pre študentov').check();
      const title = await page.locator('.second-title').first().textContent();
      const ribbonVisible = await page.locator('.ant-ribbon').first().isVisible();
      if (title?.trim() === 'test1' && ribbonVisible) return;
      throw new Error('Podmienky neboli splnené');
    } catch (error) {
      console.error(`Pokus ${attempts} zlyhal: ${error.message}`);
    if (attempts === 2) throw error;
    }
  }
});

test('top_until_aktuality', async ({ page }) => {
  let success = false;
  let attempts = 0;
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();
      await page.getByRole('row', { name: 'test1' }).getByRole('button').first().click();
      const zobrazitDo = await page.getByLabel('Zobrazovať navrchu do').inputValue();
      const zaciatok = await page.getByLabel('Začiatok platnosti').inputValue();
      const parseDate = (s: string) => {
        const [d, m, rest] = s.split('.');
        const [y, t] = rest.trim().split(' ');
        const [h, min] = t.split(':');
        return new Date(+y, +m - 1, +d, +h, +min);
      };
      const rozdielSekund = Math.floor(
      (parseDate(zobrazitDo).getTime() - parseDate(zaciatok).getTime()) / 1000);
      if (rozdielSekund === 10080 * 60) {
        success = true;
      } else {
        throw new Error(`Rozdiel nie je 7 dní. Rozdiel: ${rozdielSekund} sekúnd`);
      }
    } catch (error) {
      console.error(`Test zlyhal na pokus č. ${attempts}: ${error.message}`);
      await page.getByRole('link', { name: 'Aktuality' }).click();
      if (attempts >= 2) throw error;
    }
  }
});

test('mazanie_aktuality', async ({ page }) => {
  let success = false;
  attempts = 0;
  while (!success && attempts < 2) {
    try {
      attempts++;
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').click();
      await page.getByRole('searchbox').fill('test1');
      await page.getByRole('button', { name: 'search' }).nth(2).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator1 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator1).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });  
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').click();
      await page.getByRole('searchbox').fill('test3');
      await page.getByRole('button', { name: 'search' }).nth(2).click();    
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator2).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Názov (slovensky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('button', { name: 'close-circle' }).click();
      await page.getByLabel('Názov (anglicky)').getByRole('button', { name: 'search' }).click();
      await page.getByRole('searchbox').nth(1).fill('test2');
      await page.getByRole('searchbox').nth(1).press('Enter');
      await page.getByRole('button', { name: 'delete' }).click();
      await page.getByRole('button', { name: 'Áno' }).click();
      await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
      const locator3 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
      await expect(locator3).toHaveText('Položka úspešne vymazaná', { timeout: 10000 });
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
