import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
    public readonly inventoryItem: Locator;
    public readonly filter: Locator;
    public readonly itemName: Locator;
    public readonly cartButton: Locator;
    public readonly cartBadge: Locator;
    public readonly addToCartBtn: Locator;
    public readonly itemPrice: Locator;

    constructor(public readonly page: Page) {
        this.inventoryItem = page.locator('[data-test="inventory-item"]');
        this.filter = page.locator('[data-test="product-sort-container"]');
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.cartButton = page.locator('[data-test="shopping-cart-link"]')
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.addToCartBtn = page.locator('.btn_inventory');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    }

    /**
     * @param itemCount
     * @param index
     * @param count
     */

    async navigateToInventory(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyItemsDisplayed() {
        await expect(this.inventoryItem).toHaveCount(6);
    }

    async verifyNameAndPrice() {
        const items = this.inventoryItem;;
        const itemCount = await items.count();
        for (let i = 0; i < itemCount; i++) {
            await expect(items.nth(i).locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
            await expect(items.nth(i).locator('[data-test="inventory-item-price"]')).not.toBeEmpty();
        }   
    }

    async useFilterZA() {
        await expect(this.filter).toBeVisible();
        await this.filter.selectOption('za');
    }

    async verifyItemsAreSortedZA() {
        const names = await this.itemName.allTextContents();
        const sortedNames = [...names].sort().reverse();
        expect(names).toEqual(sortedNames);
    }

    async verifyItemCountInCartBadge(itemCount: string): Promise <void> {
        const cartBadgeNum = this.cartBadge;
        const badgeText = await cartBadgeNum.textContent();
        expect(badgeText?.trim()).toBe(itemCount);
    }

    async getProductName(index: number): Promise<string> {
        return await this.itemName.nth(index).innerText();
    }

    async getProductPrice(index: number): Promise<number> {
        const price_text = await this.itemPrice.nth(index).innerText();
        const productPriceText = parseFloat(price_text.replace('$', ''));
        return productPriceText;
    }

    async addItem(index: number) {
        await this.addToCartBtn.nth(index).click();
    }

    async addMultipleItems(count: number): Promise<{ productName: string[]; productPrice: number[] }> {
        const productName: string[] = [];
        const productPrice: number[] = [];
        for (let i = 0; i < count; i++) {
        const name = await this.getProductName(i);
        const price = await this.getProductPrice(i);
        productName.push(name);
        productPrice.push(price);
        await this.addItem(i);
        }
        return { productName, productPrice };
    }

    async remove1Item() {
        await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    }

    async removeAllItems() {
        await this.page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await this.page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    }

    async clickCartButton() {
        await this.cartButton.click();
    }
}