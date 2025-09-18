import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
    public readonly checkoutFirstNameInput: Locator;
    public readonly checkoutLastNameInput: Locator;
    public readonly checkoutZipCode: Locator;
    public readonly continueBtn: Locator;
    public readonly checkoutHeader: Locator;
    public readonly checkoutError: Locator;
    public readonly subtotalText: Locator;
    public readonly taxText: Locator;
    public readonly totalText: Locator;
    public readonly cancelButton: Locator;
    public readonly finishButton: Locator;
    public readonly backHome: Locator;
    public readonly completeHeader: Locator;

    constructor(public readonly page: Page) {
        this.checkoutFirstNameInput = page.locator('[data-test="firstName"]');
        this.checkoutLastNameInput = page.locator('[data-test="lastName"]');
        this.checkoutZipCode = page.locator('[data-test="postalCode"]');
        this.continueBtn = page.locator('[data-test="continue"]');
        this.checkoutHeader = page.locator('[data-test="title"]');
        this.checkoutError = page.locator('[data-test="error"]');
        this.subtotalText = page.locator('[data-test="subtotal-label"]');
        this.taxText = page.locator('[data-test="tax-label"]');
        this.totalText = page.locator('[data-test="total-label"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.backHome = page.locator('[data-test="back-to-products"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
    }

    /**
     * @param firstName
     * @param lastName
     * @param zipCode
     */

    async enterDetails(firstName: string, lastName: string, zipCode: string): Promise<void>{
        await this.checkoutFirstNameInput.fill(firstName);
        await this.checkoutLastNameInput.fill(lastName);
        await this.checkoutZipCode.fill(zipCode);
        await this.continueBtn.click();
    }

    async verifyCheckout2Redirected() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.checkoutHeader).toBeVisible();
        await expect(this.checkoutHeader).toHaveText("Checkout: Overview");
    }

    async verifyCheckoutErrorMessage() {
        await expect(this.checkoutError).toBeVisible();
        await expect(this.checkoutError).toContainText("First Name is required");
    }

    async getSubtotal(): Promise<number>{
        const subtotal_text = await this.subtotalText.innerText();
        const subtotal = parseFloat(subtotal_text.replace('Item total: $', ''));
        return subtotal;
    }

    async getTax(): Promise<number>{
        const tax_text = await this.taxText.innerText();
        const tax = parseFloat(tax_text.replace('Tax: $', ''));
        return tax;
    }

    async getTotal(): Promise<number>{
        const total_text = await this.totalText.innerText();
        const total = parseFloat(total_text.replace('Total: $', ''));
        return total;
    }

    async clickCancelBtn() {
        await this.cancelButton.click();
    }

    async clickFinishBtn() {
        await this.finishButton.click();
    }

    async verifyCCRedirected() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.checkoutHeader).toBeVisible();
        await expect(this.checkoutHeader).toHaveText("Checkout: Complete!");
        await expect(this.completeHeader).toBeVisible();
        await expect(this.completeHeader).toHaveText("Thank you for your order!");
    }

    async clickBackHomebtn() {
        await this.backHome.click();
    }
}