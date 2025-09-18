import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    public readonly usernameInput: Locator;
    public readonly passwordInput: Locator;
    public readonly loginButton: Locator;
    public readonly swagLabsHeader: Locator;
    public readonly errorMessage: Locator;
    public readonly burgerMenuBtn: Locator;
    public readonly logoutButton: Locator;

    constructor(public readonly page: Page) {
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.swagLabsHeader = page.locator('text=Swag Labs');
        this.errorMessage = page.locator('[data-test="error"]');
        this.burgerMenuBtn = page.locator('#react-burger-menu-btn');
        this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
    }

    async navigateTo(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
    * @param username - The username to log in with
    * @param password - The password to log in with
    * @param expectedErrorMessage - The expected error message.
    */

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginSuccess(): Promise<void> {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.swagLabsHeader).toBeVisible();
        await expect(this.swagLabsHeader).toHaveText("Swag Labs");
    }

    async verifyLoginError(expectedErrorMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedErrorMessage);
    }

    async browserBackButton() {
        await this.page.goBack();
    }

    async logout() {
        await this.burgerMenuBtn.click();
        await this.logoutButton.click();
    }

    // Modular POM
    async InputUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }
    async InputPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }
}