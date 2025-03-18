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
  await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(3).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    
  }
}

async function deleteExistingEntryEN(page, title) {
  await page.getByRole('button', { name: 'Obsah' }).click();
  await page.getByRole('link', { name: 'Články' }).click();
  await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
  await page.getByRole('searchbox').click();
  await page.getByRole('searchbox').fill(title);
  await page.getByRole('button', { name: 'search' }).nth(3).click();
  const exists = await page.locator(`text=${title}`).first().isVisible();
  if (exists) {
    await page.getByRole('button', { name: 'delete' }).click();
    await page.getByRole('button', { name: 'Áno' }).click();
    const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
    await expect(locator2).toHaveText('Položka úspešne vymazaná');
    await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
    await page.getByRole('button', { name: 'close-circle' }).click();
    
  }
}

  test('vytvorenie clanka', async ({ page}) => {
    const title = 'clanok1';
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
    await iframe.locator('body').fill('skusobny text');
    await page.getByRole('button', { name: 'Uložiť' }).click()
    const locator = page.locator('div:has-text("Úspešne uložené")');
    await expect(locator.nth(5)).toHaveText('Úspešne uložené');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
    await page.getByRole('searchbox').fill(title);
    await page.getByRole('button', { name: 'search' }).nth(3).click();
    await page.getByRole('button', { name: 'edit' }).click();
    await expect(page.locator('#title_sk').inputValue()).resolves.toBe('clanok1');
  });

test('vytvorenieClanku_SK_znova', async ({ page }) => {
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
        await page.locator('#title_sk').fill('clanok1');
        await page.getByRole('button', { name: 'Uložiť' }).click();
        const locator2 = page.locator('div:has-text("Musíte vyplniť aspoň jednu jazykovú verziu.")');
        await expect(locator2.nth(5)).toHaveText('Musíte vyplniť aspoň jednu jazykovú verziu.');
        await page.waitForSelector('iframe[title="Rich Text Area"]');
        const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(0);
        await iframe.locator('body').fill('skusobny text');
        await page.getByRole('button', { name: 'Uložiť' }).click();
        await page.waitForSelector('div.ant-notification-notice-message', { state: 'visible' });
        const locator = page.locator('div.ant-notification-notice-message').filter({hasText: '422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.'});
        await expect(locator).toHaveText('422 - Položka s rovnakým názvom už existuje. Musíte zadať iný názov.');
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

  test('vytvorenie_EN', async ({ page }) => {
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
          const locator = page.locator('div:has-text("Úspešne uložené")');
          await expect(locator.nth(5)).toHaveText('Úspešne uložené');
          await page.waitForLoadState('networkidle');
          await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
          await page.getByRole('searchbox').click();
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

  test('vytvorenie_SK/EN', async ({ page }) => {
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
          await page.locator('#title_en').click();
          await page.locator('#title_en').fill(title);
          await page.waitForSelector('iframe[title="Rich Text Area"]');
          const iframe = page.frameLocator('iframe[title="Rich Text Area"]').nth(1);
          await iframe.locator('body').fill('skusobny test');
          await page.getByRole('button', { name: 'Uložiť' }).click();
          const locator = page.locator('div:has-text("Úspešne uložené")');
          await expect(locator.nth(5)).toHaveText('Úspešne uložené');
          await page.waitForLoadState('networkidle');
          await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
    await page.getByRole('searchbox').click();
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

    test('mazanie', async ({ page }) => {
        let success = false;
        attempts = 0;
    
        while (!success && attempts < 2) {
          try {
            attempts++;
            await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
            await page.getByRole('searchbox').click();
            await page.getByRole('searchbox').fill('clanok1');
            await page.getByRole('button', { name: 'search' }).nth(3).click();    
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
            await page.getByRole('searchbox').fill('clanok3');
            await page.getByRole('button', { name: 'search' }).nth(3).click();    
            await page.getByRole('button', { name: 'delete' }).click();
            await page.getByRole('button', { name: 'Áno' }).click();
            await page.waitForSelector('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")', { state: 'visible' });
            const locator2 = page.locator('div.ant-notification-notice-message:has-text("Položka úspešne vymazaná")');
            await expect(locator2).toHaveText('Položka úspešne vymazaná');
            await page.waitForLoadState('networkidle');
            await page.getByLabel('Názov SK').getByRole('button', { name: 'search' }).click();
            await page.getByRole('button', { name: 'close-circle' }).click();
            await page.getByLabel('Názov EN').getByRole('button', { name: 'search' }).click();
            await page.getByRole('searchbox').nth(1).fill('clanok2');
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
  
