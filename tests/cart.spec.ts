import { test, expect } from '../shared/base.ts';
import { attachScreenshot } from '../shared/helpers.ts';
import { generateTestUser } from '../shared/fakerUtils';

const userDetails = generateTestUser();

test.describe('Inventory Tests', {
    annotation: { type: 'Functional and UI', description: 'Tests inventory page and filter functionality' }
}, () => {
    test.beforeEach(async ({inventoryPage}) => {
        await inventoryPage.navigateToInventory();
    });

    test('Verify that there are items displayed', {tag: '@UI'}, async ({ inventoryPage }) => {
        await test.step('Verify that there are 6 items displayed', async () => {
            await inventoryPage.verifyItemsDisplayed();
        });
        await test.step('Verify that each item has a name and price displayed', async () => {
            await inventoryPage.verifyNameAndPrice();
        });
    });

    test('Verify that the filter functionality works', {tag: '@Functional'}, async ({ inventoryPage }, testInfo) => {
         await test.step('Attach Screenshot Before "Name (Z to A)" Filter', async () => {
            await attachScreenshot(
                inventoryPage.page,
                testInfo,
                'before_Z2A_filter_screenshot',
            );
        });
        await test.step('Select the "Name (Z to A)" filter', async () => {
            await inventoryPage.useFilterZA();
        });
        await test.step('Verify that items are sorted by name from Z to A', async () => {
            await inventoryPage.verifyItemsAreSortedZA();
        });
         await test.step('Attach Screenshot After "Name (Z to A)" Filter', async () => {
            await attachScreenshot(
                inventoryPage.page,
                testInfo,
                'after_Z2A_filter_screenshot',
            );
        });
    });

    test('Should show shopping cart button', {tag: '@UI'}, async ({inventoryPage}) => {
        await expect(inventoryPage.cartButton).toBeVisible();
    });

    test('Should update cart badge when an item is added to cart', {tag: ['@Functional', '@UI']}, async ({inventoryPage}, testInfo) => {
        await test.step('Verify that cart badge is initially not visible', async () => {
            await expect(inventoryPage.cartBadge).not.toBeVisible();
        });
         await test.step('Attach Screenshot Before adding items to cart', async () => {
            await attachScreenshot(
                inventoryPage.page,
                testInfo,
                'before_adding_items_screenshot',
            );
        });
        await test.step('Add 3 items to the cart', async () => {
            await inventoryPage.addMultipleItems(3);
        });
        await test.step('Verify that the cart badge has the correct count', async () => {
            await inventoryPage.verifyItemCountInCartBadge("3");
        });
         await test.step('Attach Screenshot After adding items to cart', async () => {
            await attachScreenshot(
                inventoryPage.page,
                testInfo,
                'after_adding_items_screenshot',
            );
        });
    });

    test('Verify cart badge disappears when all items are removed from cart', {tag: ['@Functional', '@UI']}, async ({inventoryPage}) => {
        await test.step('Add 3 items to the cart', async () => {
            await inventoryPage.addMultipleItems(3);
        });
        await test.step('Verify that the cart badge has the correct count', async () => {
            await inventoryPage.verifyItemCountInCartBadge("3");
        });
        await test.step('Remove one Item from the cart', async () => {
            await inventoryPage.remove1Item();
        });
        await test.step('Verify that the cart badge has the correct count', async () => {
            await inventoryPage.verifyItemCountInCartBadge("2");
        });
        await test.step('Remove all Items from the cart', async () => {
            await inventoryPage.removeAllItems();
        });
        await test.step('Verify that the cart badge is not visible', async () => {
            await expect(inventoryPage.cartBadge).not.toBeVisible();
        });
    });
});

test.describe('Cart Tests', {
    annotation: { type: 'Functional and UI', description: 'Tests cart page and functionality' }
}, () => {
    test.beforeEach(async ({inventoryPage}) => {
        await inventoryPage.navigateToInventory();
    });

    test('Should list the correct product in cart when an item is added to cart', {tag: ['@Functional', '@UI']}, async ({loginPage, inventoryPage, cartPage}, testInfo) => {
        let productNames: string[] = [];
        await test.step('Verify that cart is initially empty', async () => {
            await inventoryPage.clickCartButton();
        });
        await test.step('Add 3 items to the cart', async () => {
            await loginPage.browserBackButton();
            const result = await inventoryPage.addMultipleItems(3);
            productNames = result.productName;
        });
        await test.step('Click the cart button', async () => {
            await inventoryPage.clickCartButton();
        });
        await test.step('Verify that the cart page has the correct products', async () => {
            await cartPage.verifyCartItem();
            const cartProducts = await cartPage.getCartProductNames();
            expect(cartProducts).toEqual(productNames);
        });
        await test.step('Attach Screenshot', async () => {
            await attachScreenshot(
                cartPage.page,
                testInfo,
                'cart_page_w_items_screenshot',
            );
        });
    });

    test('Verify cart items disappear when all items are removed from cart', {tag: ['@Functional', '@UI']}, async ({inventoryPage, cartPage}, testInfo) => {
        await test.step('Add 3 items to the cart', async () => {
            await inventoryPage.addMultipleItems(3);
        });
        await test.step('Click the cart button', async () => {
            await inventoryPage.clickCartButton();
        });
        await test.step('Remove item from the cart', async () => {
            await inventoryPage.remove1Item();
            await inventoryPage.removeAllItems();
        });
        await test.step('Verify that cart is empty', async () => {
            await expect(cartPage.cartItem).not.toBeVisible();
        });
        await test.step('Attach Screenshot Before adding items to cart', async () => {
            await attachScreenshot(
                cartPage.page,
                testInfo,
                'cart_empty_screenshot',
            );
        });
    });

    test('Verify Continue SHopping button redirects back to inventory', {tag: ['@Functional', '@UI']}, async ({inventoryPage, cartPage}) => {
        await test.step('Click the cart button', async () => {
            await inventoryPage.clickCartButton();
        });
        await test.step('Verify that Continue Shopping button is visible', async () => {
            await expect(cartPage.continueShoppingBtn).toBeVisible();
        });
        await test.step('Click Continue Shopping button', async () => {
            await cartPage.clickContinueShoppingBtn();
        });
        await test.step('Verify that user is redirected back to Inventory page', async () => {
            await cartPage.verifyInventoryRedirected();
        });
    });

    test('Verify Checkout button redirects to Checkout Step 1', {tag: ['@Functional', '@UI']}, async ({inventoryPage, cartPage}, testInfo) => {
        await test.step('Click the cart button', async () => {
            await inventoryPage.clickCartButton();
        });
        await test.step('Verify that Checkout button is visible', async () => {
            await expect(cartPage.checkOutBtn).toBeVisible();
        });
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
        });
        await test.step('Verify that user is redirected to Checkout step 1 page', async () => {
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Attach Screenshot Before adding items to cart', async () => {
            await attachScreenshot(
                cartPage.page,
                testInfo,
                'checkout_page1_screenshot',
            );
        });
    });
});

test.describe('Checkout Tests', {
    annotation: { type: 'Functional and UI', description: 'Tests checkout process' }
}, () => {
    test.beforeEach(async ({inventoryPage}) => {
        await inventoryPage.navigateToInventory();
        await inventoryPage.clickCartButton();
    });

    test('Verify Continue button redirects to Checkout Step 2 page', {tag: ['@Functional', '@UI', '@HappyPath']}, async ({cartPage, checkoutPage}, testInfo) => {
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Enter valid first name, last name, zip code', async () => {
            await checkoutPage.enterDetails(userDetails.firstName, userDetails.lastName, userDetails.zipCode);
        });
        await test.step('Verify that user is redirected to Checkout step 2 page', async () => {
            await checkoutPage.verifyCheckout2Redirected();
        });
        await test.step('Attach Screenshot Before adding items to cart', async () => {
            await attachScreenshot(
                checkoutPage.page,
                testInfo,
                'checkout_page2_screenshot',
            );
        });
    });

    test('Should display error message when fields are left empty', {tag: ['@Functional', '@UI', '@UnhappyPath']}, async ({cartPage, checkoutPage}, testInfo) => {
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Leave fields empty', async () => {
            await checkoutPage.enterDetails('', '', '');
        });
        await test.step('Verify that error message is displayed', async () => {
            await checkoutPage.verifyCheckoutErrorMessage();
        });
        await test.step('Attach Screenshot Before adding items to cart', async () => {
            await attachScreenshot(
                checkoutPage.page,
                testInfo,
                'checkout_page1_unsuccessful_screenshot',
            );
        });
    });

    test('Verify correct items, total, and tax are displayed', {tag: ['@Functional', '@UI']}, async ({checkoutPage, inventoryPage, cartPage}) => {
        let productNames: string[] = [];
        let productPrices: number[] = [];
        await test.step('Add 2 items to the cart', async () => {
            await cartPage.clickContinueShoppingBtn();
            const result = await inventoryPage.addMultipleItems(3);
            productNames = result.productName;
            productPrices = result.productPrice;
            await inventoryPage.clickCartButton();
        });
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Enter valid first name, last name, zip code', async () => {
            await checkoutPage.enterDetails(userDetails.firstName, userDetails.lastName, userDetails.zipCode);
            await checkoutPage.verifyCheckout2Redirected();
        });
        await test.step('Verify items, total, and tax are displayed and correct', async () => {
            await cartPage.verifyCartItem();
            const cartProducts = await cartPage.getCartProductNames();
            const cartPrices = await cartPage.getCartProductPrices();
            const subtotal = await checkoutPage.getSubtotal();
            const tax = await checkoutPage.getTax();
            const total = await checkoutPage.getTotal();
            expect(cartProducts).toEqual(productNames);
            expect(cartPrices).toEqual(productPrices);
            expect(subtotal).toBeCloseTo(productPrices.reduce((a, b) => a + b, 0), 2); 
            expect(total).toBeCloseTo(subtotal + tax, 2); 
        });
    });

    test('Should redirect to Inventory page when Cancel button on Checkout step 2 page is clicked ', async ({cartPage, checkoutPage}) => {
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Enter valid first name, last name, zip code', async () => {
            await checkoutPage.enterDetails(userDetails.firstName, userDetails.lastName, userDetails.zipCode);
        });
        await test.step('Verify that user is redirected to Checkout step 2 page', async () => {
            await checkoutPage.verifyCheckout2Redirected();
        });
        await test.step('Click Cancel button and verify that user is redirected to Inventory page', async () => {
            await checkoutPage.clickCancelBtn();
            await cartPage.verifyInventoryRedirected();
        });
    });

    test('Should redirect to Cart page when Cancel button on Checkout step 1 page is clicked ', async ({cartPage, checkoutPage}) => {
        await test.step('Click Checkout button', async () => {
            await cartPage.clickCheckoutBtn();
            await cartPage.verifyCheckoutRedirected();
        });
        await test.step('Click Cancel button and verify that user is redirected to Cart page', async () => {
            await checkoutPage.clickCancelBtn();
            await cartPage.verifyCartRedirected();
        });
    });

    test.describe('- Finish Order', () => {
        test.beforeEach(async ({inventoryPage, cartPage, checkoutPage}) => {
            await inventoryPage.navigateToInventory();
            await inventoryPage.addMultipleItems(3);
            await inventoryPage.clickCartButton();
            await cartPage.clickCheckoutBtn();
            await checkoutPage.enterDetails(userDetails.firstName, userDetails.lastName, userDetails.zipCode);
        });

        test('Should redirect to Checkout Complete Page when Finish button is clicked', async ({checkoutPage}, testInfo) => {
            await test.step('Click Finish button', async () => {
                await checkoutPage.clickFinishBtn();
            });
            await test.step('Verify user is redirected to Checkout Complete page', async () => {
                await checkoutPage.verifyCCRedirected();
            });
            await test.step('Attach Screenshot Before adding items to cart', async () => {
                await attachScreenshot(
                    checkoutPage.page,
                    testInfo,
                    'checkout_complete_screenshot',
                );
            });
        });

        test('Should redirect to Inventory Page when Back Home button is clicked', async ({cartPage, checkoutPage}) => {
            await test.step('Click Finish button', async () => {
                await checkoutPage.clickFinishBtn();
                await checkoutPage.verifyCCRedirected();
            });
            await test.step('Click Back Home button', async () => {
                await checkoutPage.clickBackHomebtn();
            });
            await test.step('Verify user is redirected to Inventory page', async () => {
                await cartPage.verifyInventoryRedirected();
            });
        });
    });
});