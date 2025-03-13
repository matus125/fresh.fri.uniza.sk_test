import { test} from '@playwright/test';

    test('Uloženie session ako admin', async ({ page, context }) => {
      await page.goto('https://fresh.fri.uniza.sk/');
      await page.getByRole('button', { name: 'Accept all' }).click();
      await page.getByRole('button', { name: 'SK' }).nth(1).click();
      await page.getByRole('link', { name: 'user Prihlásenie' }).nth(1).click();
      await page.getByLabel('Prihlasovacie meno').fill('hrkut');
      await page.getByLabel('Heslo').fill('fricka');
      await page.getByRole('button', { name: 'Prihlásiť' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForURL('https://fresh.fri.uniza.sk/cms', { timeout: 10000 });
      await context.storageState({ path: 'playwright/.auth/auth.json' });
    });
