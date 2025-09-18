import { test, expect } from '../shared/base';
import { attachScreenshot } from '../shared/helpers.ts';
import users from '../test-data/users.json';

test.describe('Login - Data Driven Test', {
    annotation: { type: 'data-driven', description: 'Tests login with multiple users' }
}, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });
  users.forEach(user => {
    test(`Login test for ${user.username}`, async ({loginPage}, testInfo) => {
        await test.step(`Login with ${user.username} credentials`, async() => {
            await loginPage.login(user.username, user.password);
        });
        if (user.expected === 'success'){
            await test.step("Verify login was successful", async () => {
                await loginPage.verifyLoginSuccess();
            });
            await test.step("Attach Screenshot", async () => {
                await attachScreenshot(
                    loginPage.page,
                    testInfo,
                    `${user.username}_login_success_screenshot`,
                );
            });
        } else{
            await test.step('Verify error message is displayed', async () => {
                await loginPage.verifyLoginError("Sorry, this user has been locked out");
            });
        }
    });
  });
});
//run lighthouse
//add read me