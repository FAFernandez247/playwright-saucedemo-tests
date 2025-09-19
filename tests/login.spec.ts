import { test } from '../shared/base.ts';
import { attachScreenshot } from '../shared/helpers.ts';

const LOGIN_ERROR_MESSAGE = "Epic sadface: Username and password do not match any user in this service";

test.describe('Login Tests', {
    annotation: { type: 'Functional', description: 'Tests login functionality with valid and invalid credentials' }
}, () => {
    test.beforeEach(async ({loginPage}) =>{
        await loginPage.navigateTo();
    });
    test('Should successfully login', { tag: '@HappyPath' }, async ({loginPage}, testInfo) => {
        await test.step('Login with valid credentials', async() => {
            await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify login was successful", async () => {
            await loginPage.verifyLoginSuccess();
        });
        await test.step("Attach Screenshot", async () => {
            await attachScreenshot(
                loginPage.page,
                testInfo,
                'login_success_screenshot',
            );
        });
    });
    test("Should unsuccessfully login with invalid credentials", { tag: "@UnhappyPath" }, async ({loginPage}, testInfo) => {
        await test.step("Login with invalid credentials", async () => {
            await loginPage.login("invalid_user", "invalid_password");
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError(LOGIN_ERROR_MESSAGE);
        });
        await test.step("Attach Screenshot", async () => {
            await attachScreenshot(
                loginPage.page,
                testInfo,
                'login_failure_screenshot',
            );
        });
    });
    test("Should unsuccessfully login with empty fields", { tag: "@UnhappyPath" }, async ({loginPage}) => {
        await test.step("Login with empty fields", async () => {
            await loginPage.login("", "");
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Epic sadface: Username is required");
        });
    });
    test("Should unsuccessfully login with empty password", { tag: "@UnhappyPath" }, async ({loginPage}) => {
        await test.step("Login with valid username and leave password empty", async () => {
            await loginPage.login(process.env.SAUCE_USERNAME!, "");
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Epic sadface: Password is required");
        });
    });
    test("Should unsuccessfully login with locked out user credentials", { tag: "@UnhappyPath" }, async ({loginPage}) => {
        await test.step("Login with locked out username", async () => {
            await loginPage.login(process.env.SAUCE_LOCKED_USERNAME!, process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Sorry, this user has been locked out");
        });
    });
    test("Should not allow login with username containing leading/trailing spaces", { tag: "@UnhappyPath" }, async ({loginPage}) => {
        await test.step('Login with whitespace in username and valid password', async() => {
            await loginPage.login(" standard_user ", process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Username and password do not match any user in this service");
        });
    });
    test("Should allow login by pressing Enter key", {tag: "@HappyPath"}, async ({loginPage}) => {
        await test.step('Enter valid username and password', async() => {
            await loginPage.usernameInput.fill(process.env.SAUCE_USERNAME!);
            await loginPage.passwordInput.fill(process.env.SAUCE_PASSWORD!);
        });
        await test.step('Press Enter', async() => {
            await loginPage.passwordInput.press('Enter');
        });
        await test.step("Verify login was successful", async () => {
            await loginPage.verifyLoginSuccess();
        });
    });
});

test.describe('Case Sensitivity Test', { 
  annotation: { type: 'validation', description: 'Tests case sensitivity rules for login fields' } 
}, async () => {
    test.beforeEach(async ({loginPage}) =>{
        await loginPage.navigateTo();
    });
    test("Should not allow login with valid username in uppercase", {tag: "@UnhappyPath"}, async ({loginPage}) => {
        await test.step('Login with valid username in all uppercase and valid password', async() => {
            await loginPage.login(process.env.SAUCE_USERNAME!.toUpperCase(), process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Username and password do not match any user in this service");
        });
    });
    test("Should not allow login with valid password in uppercase", {tag: "@UnhappyPath"}, async ({loginPage}) => {
        await test.step('Login with valid username and valid password in all uppercase', async() => {
            await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!.toUpperCase());
        });
        await test.step("Verify error message is displayed", async () => {
            await loginPage.verifyLoginError("Username and password do not match any user in this service");
        });
    });
});

test.describe('Session handling tests', {
    annotation: { type: 'Functional', description: 'Tests login functionality with valid and invalid credentials' }
}, () => {
    test.beforeEach(async ({loginPage}) =>{
        await loginPage.navigateTo();
    });
    test.fail('Should stay logged in if the browser back button is clicked', {annotation: {type: 'Expected to fail', description: 'User is navigated back to the login page'}, tag: ['@HappyPath', '@Issue']}, async ({loginPage}) => {
        await test.step('Login with valid credentials', async() => {
            await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify login was successful", async () => {
            await loginPage.verifyLoginSuccess();
        });
        await test.step("Press back button", async () => {
            await loginPage.browserBackButton();
        });
        await test.step("Verify user is still logged in", async () => {
            await loginPage.verifyLoginSuccess();
        });        
    });
    test('Should stay logged out if the browser back button is clicked', {tag: ['@UnhappyPath']}, async ({loginPage}) => {
        await test.step('Login with valid credentials', async() => {
            await loginPage.login(process.env.SAUCE_USERNAME!, process.env.SAUCE_PASSWORD!);
        });
        await test.step("Verify login was successful", async () => {
            await loginPage.verifyLoginSuccess();
        });
        await test.step("Logout", async () => {
            await loginPage.logout();
        });
        await test.step("Press back button", async () => {
            await loginPage.browserBackButton();
        });
        await test.step("Verify error message is displayed and user is still in the login page", async () => {
            await loginPage.verifyLoginError("You can only access '/inventory.html' when you are logged in.");
        });        
    });
    test('Should stay on login page when accessing cart page directly', {tag: ['@HappyPath']}, async ({loginPage, page}) => {
        await test.step('Open /cart.html directly without logging in', async() => {
            await page.goto('https://www.saucedemo.com/cart.html')
        });
        await test.step("Verify error message is displayed and user is still in the login page", async () => {
            await loginPage.verifyLoginError("You can only access '/cart.html' when you are logged in.");
        });        
    });
});