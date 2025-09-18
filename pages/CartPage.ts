import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
    public readonly cartItem: Locator;
    public readonly cartItemName: Locator;
    public readonly continueShoppingBtn: Locator;
    public readonly checkOutBtn: Locator;
    public readonly checkoutHeader: Locator;
    public readonly cartItemPrice: Locator;

    constructor(public readonly page: Page) {
        this.cartItem = page.locator('[data-test="inventory-item"]');
        this.cartItemName = page.locator('[data-test="inventory-item-name"]');
        this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
        this.checkOutBtn = page.locator('[data-test="checkout"]');
        this.checkoutHeader = page.locator('[data-test="title"]');
        this.cartItemPrice = page.locator('[data-test="inventory-item-price"]');
    }

    async verifyCartItem() {
        const cartItems = this.cartItem;
        const cartItemCount = await cartItems.count();
        for (let i = 0; i < cartItemCount; i++) {
            await expect(cartItems.nth(i).locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
            await expect(cartItems.nth(i).locator('[data-test="inventory-item-price"]')).not.toBeEmpty();
            await expect(cartItems.nth(i).locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
            await expect(cartItems.nth(i).locator('[data-test="item-quantity"]')).not.toBeEmpty();
        }
    }

    async getCartProductNames(): Promise<string[]> {
        return await this.cartItemName.allInnerTexts();
    }

    async getCartProductPrices(): Promise<number[]> {
        const cartProductPriceText = await this.cartItemPrice.allInnerTexts();
        return cartProductPriceText.map(p => parseFloat(p.replace('$', '')));
    }

    async clickContinueShoppingBtn() {
        await this.continueShoppingBtn.click();
    }

    async verifyInventoryRedirected() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.cartItem).toHaveCount(6);
    }

    async clickCheckoutBtn() {
        await this.checkOutBtn.click();
    }

    async verifyCheckoutRedirected() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.checkoutHeader).toBeVisible();
        await expect(this.checkoutHeader).toHaveText("Checkout: Your Information");
    }

    async verifyCartRedirected() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.checkoutHeader).toBeVisible();
        await expect(this.checkoutHeader).toHaveText("Your Cart");
    }
}
