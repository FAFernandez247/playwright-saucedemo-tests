import { test as setup } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import {LoginPage } from '../pages/LoginPage';

setup('Do login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo();
    await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
    await loginPage.verifyLoginSuccess();
    await page.context().storageState({ path: STORAGE_STATE });
});
